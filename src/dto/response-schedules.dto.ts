import { IsNotEmpty, IsObject } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { SelectedDateSchedule } from '../interfaces/schedules.interface';


export class ResponseSchedulesDto {
  @Expose()
  @IsNotEmpty()
  @IsObject()
  readonly SelectedDateSchedules: SelectedDateSchedule[];
}
