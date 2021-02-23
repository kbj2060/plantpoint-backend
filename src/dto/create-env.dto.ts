import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateEnvDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  readonly environmentSection: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly co2: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly humidity: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly temperature: number;
}
