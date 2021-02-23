import {
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class UpdateScheduleDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

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
}
