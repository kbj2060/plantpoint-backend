import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class RequestSigninDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @Expose()
  @IsNotEmpty()
  @IsDate()
  readonly created: Date;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly isDeleted: boolean;
}
