import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';


export class ResponseSigninDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly access_token: string;
}
