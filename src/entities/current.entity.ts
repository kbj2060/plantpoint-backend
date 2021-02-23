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

@Entity()
export class Current {
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
  current: number;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
