import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ReadAllCurrentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly machineSection: string;
}
