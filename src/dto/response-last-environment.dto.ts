import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class ResponseLastEnvironmentDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly co2: number = 0;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly humidity: number = 0;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  readonly temperature: number = 0;
}
