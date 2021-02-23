import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class ReadCurrentDto {
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
}
