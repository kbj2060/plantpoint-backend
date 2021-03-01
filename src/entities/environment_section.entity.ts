import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Environment } from './environment.entity';

@Entity()
export class EnvironmentSection {
  @OneToMany(() => Environment, (environment) => environment.environmentSection)
  @PrimaryGeneratedColumn()
  id: Environment;

  @Column()
  environmentSection: string;

  @Column()
  section: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
