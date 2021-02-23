import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserInfoLength } from '../interfaces/constants';

export class CreateUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(UserInfoLength.MAX_USERNAME)
  @MinLength(UserInfoLength.MIN_USERNAME)
  readonly username: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(UserInfoLength.MAX_PASSWORD)
  @MinLength(UserInfoLength.MIN_PASSWORD)
  readonly password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
