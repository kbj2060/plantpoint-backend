import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Expose } from 'class-transformer';
import { EnvironmentHistory } from '../interfaces/environments.interface';

export class ResponseEnvironmentHistoryDto {
  @Expose()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsObject()
  readonly histories: EnvironmentHistory[];
}
