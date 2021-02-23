import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import * as Bcrypt from 'bcrypt';
import { Switch } from './switch.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class User {
  @OneToMany(() => Switch, (_switch) => _switch.controlledBy)
  @OneToMany(() => Schedule, (schedule) => schedule.createdBy)
  @PrimaryGeneratedColumn()
  id: Switch;

  @Column()
  @IsNotEmpty()
  @MaxLength(30)
  username: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(30)
  password: string;

  @Column()
  @IsNotEmpty()
  type: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;

  /* BeforeInsert 는 save 안의 파라미터가 해당 엔티티여야만 아래 함수가 실행됨. */
  @BeforeInsert()
  async beforeInsert() {
    const saltRounds = 10;
    this.password = await Bcrypt.hash(this.password, saltRounds);
  }
}
