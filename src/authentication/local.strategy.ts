import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from '../dto/signin.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userValidateDto: SigninDto = {
      username: username,
      password: password,
    };
    const user = await this.authService.validateUser(userValidateDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
