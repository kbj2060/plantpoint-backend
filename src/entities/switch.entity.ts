import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { MachineSection } from './machine_section.entity';
import { User } from './user.entity';

@Entity()
export class Switch {
  @PrimaryGeneratedColumn()
  id: number | null;

  @IsNotEmpty()
  @ManyToOne(() => MachineSection, (machineSection) => machineSection.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'machineSectionId' })
  machineSection: MachineSection;

  @Column()
  @IsNotEmpty()
  @MaxLength(30)
  machine: string;

  @Column()
  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'controlledById' })
  controlledBy: User;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
