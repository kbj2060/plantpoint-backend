import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { MachineSection } from './machine_section.entity';
import { Automation } from './automation.entity';

@Entity()
export class Machine {
  @OneToMany(() => Automation, (automation) => automation.machine)
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
  @MaxLength(30)
  automationType: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
