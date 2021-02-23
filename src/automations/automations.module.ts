import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Automation } from '../entities/automation.entity';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { Machine } from '../entities/machine.entity';
import { User } from '../entities/user.entity';
import { MachineSection } from '../entities/machine_section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Automation, Machine, User, MachineSection]),
  ],
  controllers: [AutomationsController],
  providers: [AutomationsService],
})
export class AutomationsModule {}
