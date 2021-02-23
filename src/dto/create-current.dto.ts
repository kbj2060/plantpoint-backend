import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { MachineSection } from '../entities/machine_section.entity';

export class CreateCurrentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly machineSection: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly machine: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly current: number;
}
