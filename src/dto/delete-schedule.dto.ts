import { IsNotEmpty, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class DeleteScheduleDto {
  @Expose()
  @IsArray()
  @IsNotEmpty()
  readonly ids: number[];
}
