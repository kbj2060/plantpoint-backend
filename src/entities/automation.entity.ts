import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MachineSection } from './machine_section.entity';
import { Machine } from './machine.entity';
import { User } from './user.entity';

@Entity()
export class Automation {
  @PrimaryGeneratedColumn()
  id: number | null;

  @IsNotEmpty()
  @ManyToOne(() => MachineSection, (machineSection) => machineSection.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'machineSectionId' })
  machineSection: MachineSection | string;

  @IsNotEmpty()
  @ManyToOne(() => Machine, (machine) => machine.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'machineId' })
  machine: Machine | string;

  @Column()
  @IsNotEmpty()
  enable: boolean;

  @Column()
  @IsNotEmpty()
  @MaxLength(100)
  start: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(100)
  end: string;

  @Column({ nullable: true })
  @IsOptional()
  term: number | null;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'controlledById' })
  controlledBy: User | string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;

  /* Abstract variable */
  @IsOptional()
  automationType: string;

  @AfterLoad()
  afterLoad() {
    this.start = JSON.parse(this.start);
    this.end = JSON.parse(this.end);
    if (this.machine instanceof Machine) {
      const machine: Machine = this.machine;
      this.machine = machine.machine;
      this.automationType = machine.automationType;
    }
    if (this.machineSection instanceof MachineSection) {
      this.machineSection = this.machineSection.machineSection;
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.start = JSON.stringify(this.start);
    this.end = JSON.stringify(this.end);
  }
}
