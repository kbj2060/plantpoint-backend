import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import * as Bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { SigninDto } from '../dto/signin.dto';
import { RequestSigninDto } from '../dto/request-signin.dto';
import { ResponseSigninDto } from '../dto/response-signin.dto';
import { ErrorMessages } from '../interfaces/constants';

const checkPassword = async (
  loginUserPassword: string,
  existingUserPassword: string,
): Promise<boolean> => {
  return await Bcrypt.compare(loginUserPassword, existingUserPassword);
};

const getUserProfile = (user: User) => {
  delete user.password;
  return user;
};

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signinUser: SigninDto): Promise<any> {
    const validUser: User = await this.usersService.findOne(
      signinUser.username,
    );
    if (!validUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }
    if (
      validUser &&
      (await checkPassword(signinUser.password, validUser.password))
    ) {
      return getUserProfile(validUser);
    }
    return null;
  }

  async signin(user: RequestSigninDto): Promise<ResponseSigninDto> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(userCreateDto: CreateUserDto) {
    await this.usersService.signup(userCreateDto);
  }
}
