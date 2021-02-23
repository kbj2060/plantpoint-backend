import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateSwitchDto {
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
  readonly status: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly controlledBy: string;
}
