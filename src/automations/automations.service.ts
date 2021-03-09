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
    const [ machineSection, automations ] = await Promise.all([
      await this.machineSectionRepository.findOne(
        {
          machineSection: section,
        },
      ),
      await this.automationsRepository
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
        .getMany()
    ])
    checkMachineSection(machineSection);

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
    automationCreateDto: Record<string, CreateAutomationDto>,
    controlledBy: string,
  ): Promise<void> {
    const automations: AutomationCreate[] = [];
    const user: User = await this.getUser(controlledBy);
    checkUser(user);

    for (const dto of Object.values(automationCreateDto)) {
      const [ section, machine ] = await Promise.all([
        await this.getSection(dto.machineSection), await this.getMachine(dto.machine)
      ])

      checkMachineSection(section);
      checkMachine(machine);

      automations.push({
        ...dto,
        machine: machine,
        machineSection: section,
        controlledBy: user,
      } as AutomationCreate);
    }

    await this.automationsRepository.save(plainToClass(Automation, automations));
  }
}
