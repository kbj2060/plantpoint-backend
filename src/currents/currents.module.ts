import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Current } from '../entities/current.entity';
import { CurrentsController } from './currents.controller';
import { CurrentsService } from './currents.service';
import { MachineSection } from '../entities/machine_section.entity';
import { Machine } from '../entities/machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Current, MachineSection, Machine])],
  controllers: [CurrentsController],
  providers: [CurrentsService],
})
export class CurrentsModule {}
