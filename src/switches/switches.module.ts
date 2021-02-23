import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Switch } from '../entities/switch.entity';
import { SwitchesController } from './switches.controller';
import { SwitchesService } from './switches.service';
import { MachineSection } from '../entities/machine_section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Switch, User, MachineSection])],
  controllers: [SwitchesController],
  providers: [SwitchesService],
})
export class SwitchesModule {}
