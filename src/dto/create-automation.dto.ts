import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateAutomationDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly machineSection: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly controlledBy: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly machine: string;

  @Expose()
  @IsNotEmpty()
  readonly start: string[];

  @Expose()
  @IsNotEmpty()
  readonly end: string[];

  @Expose()
  @IsOptional()
  readonly term?: number | null;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly enable: boolean;
}
