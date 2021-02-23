import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Switch } from '../entities/switch.entity';
import { Repository } from 'typeorm';
import { CreateSwitchDto } from '../dto/create-switch.dto';
import { plainToClass } from 'class-transformer';
import { ResponseLastSwitchDto } from '../dto/response-last-switch.dto';
import { ResponseHistorySwitchDto } from '../dto/response-history-switch.dto';
import { User } from '../entities/user.entity';
import { MachineSection } from '../entities/machine_section.entity';
import { MachineStatus, SwitchHistoryNumber } from '../interfaces/constants';
import {
  PowerOnSwitch,
  PowerOnMachines,
  SwitchHistory,
  SwitchCreate,
} from '../interfaces/switches.interface';
import {
  checkCurrentSwitches,
  checkMachineSection,
  checkUser,
} from '../utils/error-handler';

const extractOnMachines = (
  switches: PowerOnSwitch[],
  section: string,
): PowerOnMachines => {
  const onMachines: PowerOnMachines = <PowerOnMachines>{
    machineSection: section,
    machines: [],
  };
  switches.forEach((_switch: PowerOnSwitch) => {
    if (
      onMachines.hasOwnProperty('machineSection') &&
      _switch.status === MachineStatus.ON
    ) {
      onMachines.machines.push(_switch.machine);
    }
  });
  return onMachines;
};

@Injectable()
export class SwitchesService {
  constructor(
    @InjectRepository(Switch)
    private switchesRepository: Repository<Switch>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(MachineSection)
    private machineSectionRepository: Repository<MachineSection>,
  ) {}

  async getUser(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      username: username,
    });
  }

  async getSection(sectionName: string): Promise<MachineSection> {
    return await this.machineSectionRepository.findOne({
      machineSection: sectionName,
    });
  }

  async readLastSwitches(section: string): Promise<ResponseLastSwitchDto> {
    const machineSection: MachineSection = await this.machineSectionRepository.findOne(
      {
        machineSection: section,
      },
    );
    checkMachineSection(machineSection);

    const lastSwitch: PowerOnSwitch[] = await this.switchesRepository
      .createQueryBuilder('switch')
      .leftJoinAndSelect('switch.machineSection', 'machineSection')
      //.leftJoinAndSelect('switch.controlledBy', 'controlledBy')
      .select([
        'machineSection.machineSection AS machineSection',
        'switch.machine AS machine',
        'switch.status AS status',
      ])
      .where(
        `switch.id IN (SELECT max(id) FROM iot.switch 
                              WHERE machineSection.machineSection = \"${section}\"
                                AND status = ${MachineStatus.ON}
                              GROUP BY machine)`,
      )
      .orderBy('switch.id')
      .getRawMany();

    checkCurrentSwitches(lastSwitch);

    const onMachines: PowerOnMachines = extractOnMachines(lastSwitch, section);
    return plainToClass(ResponseLastSwitchDto, onMachines);
  }

  async readSwitchHistory(section: string): Promise<ResponseHistorySwitchDto> {
    const switchHistory: SwitchHistory[] = await this.switchesRepository
      .createQueryBuilder('switch')
      .leftJoinAndSelect('switch.machineSection', 'machineSection')
      .leftJoinAndSelect('switch.controlledBy', 'controlledBy')
      .select([
        'switch.machine AS machine',
        'switch.status AS status',
        'switch.created AS created',
        'controlledBy.username AS controlledBy',
      ])
      .where('machineSection.machineSection = :section', { section })
      .orderBy('switch.id', 'DESC')
      .limit(SwitchHistoryNumber.LIMIT)
      .getRawMany();
    return plainToClass(ResponseHistorySwitchDto, {
      switchHistory: switchHistory,
    });
  }

  async createSwitch(switchCreateDto: CreateSwitchDto): Promise<void> {
    const user: User = await this.getUser(switchCreateDto.controlledBy);
    checkUser(user);

    const section: MachineSection = await this.getSection(
      switchCreateDto.machineSection,
    );
    checkMachineSection(section);

    const _switch: SwitchCreate = {
      ...switchCreateDto,
      machineSection: section,
      controlledBy: user,
    };
    await this.switchesRepository.save(plainToClass(Switch, _switch));
  }
}
