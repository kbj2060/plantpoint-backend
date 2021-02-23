import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateScheduleDto {
  @Expose()
  @IsArray()
  @IsNotEmpty()
  readonly date: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly title: string;

  @Expose()
  @IsString()
  @MaxLength(100)
  readonly content: string;

  @Expose()
  @IsString()
  @MaxLength(20)
  readonly createdBy: string;
}
