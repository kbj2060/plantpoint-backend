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
import { flattenMachines } from '../utils/utils';
import { ReadAllCurrentDto } from '../dto/read-all-current';

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
    const [ machine, machineSection, current ]: [Machine, MachineSection, LastCurrent] = await Promise.all([
      await this.getMachine(currentReadDto.machine),
      await this.getSection(currentReadDto.machineSection),
      await this.currentsRepository
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
        .getRawOne()
    ])

    checkMachine(machine);
    checkMachineSection(machineSection);

    return plainToClass(ResponseLastCurrentDto, current);
  }

  async readAllCurrent( allCurrentReadDto: ReadAllCurrentDto ) {
    const machines: Machine[] = await this.machineRepository
      .createQueryBuilder('machine')
      .leftJoinAndSelect('machine.machineSection', 'machineSection')
      .select('machine.machine')
      .where(`machineSection = :section`, {section: allCurrentReadDto.machineSection})
      .getMany();

    const currents: ResponseLastCurrentDto[] = []
    for (const machine of flattenMachines(machines)) {
      const current = await this.currentsRepository
          .createQueryBuilder('current')
          .leftJoinAndSelect('current.machineSection', 'machineSection')
          .select([
            'current.machine AS machine',
            'machineSection.machineSection AS machineSection',
            'current.current AS current',
          ])
          .where('machine = :machine', { machine: machine })
          .andWhere('machineSection = :machineSection', {
            machineSection: allCurrentReadDto.machineSection,
          })
          .orderBy('current.id', "DESC")
          .limit(1)
          .getRawOne()
      
      currents.push(!current ? { machineSection: allCurrentReadDto.machineSection, machine: machine, current: 0 } : current);
      };

    return plainToClass(ResponseLastCurrentDto, currents);
  }

  async createCurrent(currentCreateDto: CreateCurrentDto): Promise<void> {
    const [ machine, machineSection ]: [ Machine, MachineSection ] = await Promise.all([
      await this.getMachine(currentCreateDto.machine), await this.getSection(currentCreateDto.machineSection)
    ])

    checkMachine(machine);
    checkMachineSection(machineSection);

    await this.currentsRepository.save(
      plainToClass(Current, {...currentCreateDto, machineSection: machineSection } as CurrentCreate ));
    }
}
