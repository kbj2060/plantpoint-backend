import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Machine } from './machine.entity';
import { EnvironmentSection } from './environment_section.entity';

@Entity()
export class Environment {
  @PrimaryGeneratedColumn()
  id: number | null;

  @IsNotEmpty()
  @ManyToOne(
    () => EnvironmentSection,
    (environmentSection) => environmentSection.id,
  )
  @JoinColumn({ name: 'environmentSectionId' })
  environmentSection: EnvironmentSection;

  @Column()
  @IsNotEmpty()
  co2: number;

  @Column()
  @IsNotEmpty()
  humidity: number;

  @Column()
  @IsNotEmpty()
  temperature: number;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
