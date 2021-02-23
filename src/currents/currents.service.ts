import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Current } from '../entities/current.entity';
import { CreateCurrentDto } from '../dto/create-current.dto';
import { MachineSection } from '../entities/machine_section.entity';
import { ReadCurrentDto } from '../dto/read-current';
import { CurrentCreate, LastCurrent } from '../interfaces/currents.interface';
import { plainToClass } from 'class-transformer';
import { ResponseLastCurrentDto } from '../dto/response-last-current.dto';
import { Machine } from '../entities/machine.entity';
import { checkMachine, checkMachineSection } from '../utils/error-handler';

@Injectable()
export class CurrentsService {
  constructor(
    @InjectRepository(Current)
    private currentsRepository: Repository<Current>,
    @InjectRepository(MachineSection)
    private machineSectionRepository: Repository<MachineSection>,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
  ) {}

  async getSection(sectionName: string): Promise<MachineSection> {
    return await this.machineSectionRepository.findOne({
      machineSection: sectionName,
    });
  }

  async getMachine(machine: string): Promise<Machine> {
    return await this.machineRepository.findOne({
      machine: machine,
    });
  }

  async readCurrent(
    currentReadDto: ReadCurrentDto,
  ): Promise<ResponseLastCurrentDto> {
    const machine = await this.getMachine(currentReadDto.machine);
    checkMachine(machine);

    const machineSection = await this.getSection(currentReadDto.machineSection);
    checkMachineSection(machineSection);

    const current: LastCurrent = await this.currentsRepository
      .createQueryBuilder('current')
      .leftJoinAndSelect('current.machineSection', 'machineSection')
      .select([
        'current.machine AS machine',
        'machineSection.machineSection AS machineSection',
        'current.current AS current',
      ])
      .where('machine = :machine', { machine: currentReadDto.machine })
      .andWhere('machineSection = :machineSection', {
        machineSection: currentReadDto.machineSection,
      })
      .orderBy('current.id', 'DESC')
      .getRawOne();

    return plainToClass(ResponseLastCurrentDto, current);
  }

  async createCurrent(currentCreateDto: CreateCurrentDto): Promise<void> {
    const machine = await this.getMachine(currentCreateDto.machine);
    checkMachine(machine);

    const machineSection: MachineSection = await this.getSection(
      currentCreateDto.machineSection,
    );
    checkMachineSection(machineSection);

    const current: CurrentCreate = {
      ...currentCreateDto,
      machineSection: machineSection,
    };
    await this.currentsRepository.save(plainToClass(Current, current));
  }
}
