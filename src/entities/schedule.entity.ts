import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column()
  @IsNotEmpty()
  date: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @Column()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @Column()
  @IsOptional()
  binding: number | null;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'createdById' })
  @IsNotEmpty()
  createdBy: User;

  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @BeforeInsert()
  beforeInsert() {
    this.binding = this.date.length;
    this.date = JSON.stringify(this.date);
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.binding = this.date.length;
    this.date = JSON.stringify(this.date);
  }

  @AfterLoad()
  afterLoad() {
    this.date = JSON.parse(this.date);
  }
}
