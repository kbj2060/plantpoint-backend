import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { SwitchHistory } from '../interfaces/switches.interface';

export class ResponseHistorySwitchDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly switchHistory: SwitchHistory[];
}
