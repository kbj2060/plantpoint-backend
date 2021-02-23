import { IsDateString, IsNotEmpty, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ReadScheduleDto {
  @Expose()
  @IsDateString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly date: string;
}
