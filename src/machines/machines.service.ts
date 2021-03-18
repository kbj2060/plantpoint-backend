import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Machine} from "../entities/machine.entity";
import {Repository} from "typeorm";
import {ResponseMachineDto} from "../dto/response-machine-dto";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

@Injectable()
export class MachinesService {
  constructor (
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  async readMachines (section: string): Promise<ResponseMachineDto[]> {
    this.logger.info(`${section} Section Machines Data Loaded`);
    return await this.machinesRepository
      .createQueryBuilder('machine')
      .innerJoinAndSelect(
        'machine.machineSection',
        'machineSection',
      )
      .select([
        'machine.machine AS machine',
        'machineSection.machineSection AS machineSection'
      ])
      .where(`machineSection = :section`, { section: section },)
      .orderBy('machine.id', 'DESC')
      .getRawMany();
  }
}
