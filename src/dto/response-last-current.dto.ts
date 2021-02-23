import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';


export class ResponseLastCurrentDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly machine: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly machineSection: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly current: string;
}
