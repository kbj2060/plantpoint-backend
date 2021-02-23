import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Current } from './current.entity';
import { Switch } from './switch.entity';
import { Machine } from './machine.entity';

@Entity()
export class MachineSection {
  @OneToMany(() => Current, (current) => current.machineSection)
  @OneToMany(() => Switch, (_switch) => _switch.machineSection)
  @OneToMany(() => Machine, (machine) => machine.machineSection)
  @PrimaryGeneratedColumn()
  id: Current | Switch | Machine;

  @Column()
  machineSection: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
