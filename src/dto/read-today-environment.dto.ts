import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class ReadTodayEnvironmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly environmentSection: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(10)
  readonly environmentName: string;
}
