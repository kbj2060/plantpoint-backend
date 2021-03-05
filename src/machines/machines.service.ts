import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Machine} from "../entities/machine.entity";
import {Repository} from "typeorm";
import {ResponseMachineDto} from "../dto/response-machine-dto";

@Injectable()
export class MachinesService {
  constructor (
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>,
  ) {}

  async readMachines (section: string): Promise<ResponseMachineDto[]> {
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
