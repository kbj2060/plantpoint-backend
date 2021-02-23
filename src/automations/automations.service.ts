import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation } from '../entities/automation.entity';
import { Machine } from '../entities/machine.entity';
import { CreateAutomationDto } from '../dto/create-automation.dto';
import { User } from '../entities/user.entity';
import { MachineSection } from '../entities/machine_section.entity';
import { plainToClass } from 'class-transformer';
import {
  AutomationCreate,
  LastAutomation,
} from '../interfaces/automations.interface';
import { ResponseLastAutomationDto } from '../dto/response-last-automation.dto';
import {
  checkMachine,
  checkMachineSection,
  checkUser,
} from '../utils/error-handler';

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(Automation)
    private automationsRepository: Repository<Automation>,
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(MachineSection)
    private machineSectionRepository: Repository<MachineSection>,
  ) {}

  async readAutomation(section: string): Promise<ResponseLastAutomationDto> {
    const machineSection: MachineSection = await this.machineSectionRepository.findOne(
      {
        machineSection: section,
      },
    );
    checkMachineSection(machineSection);

    const automations: LastAutomation[] = await this.automationsRepository
      .createQueryBuilder('automation')
      .innerJoinAndMapOne(
        'automation.machine',
        Machine,
        'machine',
        'automation.machineId = machine.id',
      )
      .innerJoinAndMapOne(
        'automation.machineSection',
        MachineSection,
        'section',
        'automation.machineSection = section.id',
      )
      .select([
        'automation.start',
        'automation.end',
        'automation.term',
        'automation.enable',
        'machine.machine',
        'machine.automationType',
        'section.machineSection',
      ])
      .where(
        `automation.id IN (SELECT max(id) 
                              FROM automation 
                              WHERE section.machineSection = :section
                              GROUP BY automation.machineId)`,
        { section: section },
      )
      .orderBy('automation.id', 'DESC')
      .getMany();
    return plainToClass(ResponseLastAutomationDto, {
      lastAutomations: automations,
    });
  }

  async getUser(username: string) {
    return await this.usersRepository.findOne({
      username: username,
    });
  }

  async getSection(sectionName: string) {
    return await this.machineSectionRepository.findOne({
      machineSection: sectionName,
    });
  }

  async getMachine(machine: string) {
    return await this.machinesRepository.findOne({
      machine: machine,
    });
  }

  async createAutomation(
    automationCreateDto: CreateAutomationDto,
  ): Promise<void> {
    const user: User = await this.getUser(automationCreateDto.controlledBy);
    checkUser(user);

    const section: MachineSection = await this.getSection(
      automationCreateDto.machineSection,
    );
    checkMachineSection(section);

    const machine: Machine = await this.getMachine(automationCreateDto.machine);
    checkMachine(machine);

    const automation: AutomationCreate = {
      ...automationCreateDto,
      machine: machine,
      machineSection: section,
      controlledBy: user,
    };

    await this.automationsRepository.save(plainToClass(Automation, automation));
  }
}
