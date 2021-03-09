import {Inject, Injectable, NotFoundException} from '@nestjs/common';
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
import { MqttService } from 'nest-mqtt';

const extractOnMachines = (
  switches: PowerOnSwitch[],
  section: string,
): PowerOnMachines => {
  const onMachines: PowerOnMachines = <PowerOnMachines>{
    machineSection: section,
    machines: [],
  };
  switches.forEach((_switch: PowerOnSwitch) => {
    if ( onMachines.hasOwnProperty('machineSection') && _switch.status === MachineStatus.ON ) {
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
    @Inject(MqttService)
    private readonly mqttService: MqttService,
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

  async readLastSwitches(section: string): Promise<PowerOnSwitch[]> {
    const [machineSection, lastSwitch] = await Promise.all([
      await this.machineSectionRepository.findOne(
      {
        machineSection: section,
        },
      ),
      await this.switchesRepository
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
                              GROUP BY machine)`,
        )
        .orderBy('switch.id')
        .getRawMany()
    ]);

    checkMachineSection(machineSection);
    checkCurrentSwitches(lastSwitch);

    return lastSwitch;
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

  async createSwitch(dto: CreateSwitchDto): Promise<void> {
    const [ user, section ] = await Promise.all([
      await this.getUser(dto.controlledBy), await this.getSection(dto.machineSection)
    ])

    checkUser(user);
    checkMachineSection(section);

    const _switch: SwitchCreate = {
      ...dto,
      machineSection: section,
      controlledBy: user,
    };

    await this.mqttService.publish(`switch/${dto.machineSection}/${dto.machine}`, dto.status.toString());
    await this.switchesRepository.save(plainToClass(Switch, _switch));
  }
}
