import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class SigninDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  readonly username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  readonly password: string;
}
