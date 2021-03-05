import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineSection } from '../entities/machine_section.entity';
import {Machine} from "../entities/machine.entity";
import {MachinesController} from "./machines.controller";
import {MachinesService} from "./machines.service";

@Module({
  imports: [TypeOrmModule.forFeature([Machine, MachineSection])],
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
