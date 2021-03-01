import {  IsNotEmpty, IsString } from 'class-validator';
import {  Expose } from 'class-transformer';

export class ResponseMachineDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly machineSection: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly machine: string;
}
