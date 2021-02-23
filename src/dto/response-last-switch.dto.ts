import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class ResponseLastSwitchDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly machineSection: string;

  @Expose()
  @IsArray()
  @IsNotEmpty()
  readonly machines: string[];
}
