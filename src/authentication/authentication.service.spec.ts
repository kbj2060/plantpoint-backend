import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { jwtConstants } from './secret';
import { AuthenticationModule } from './authentication.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationService } from './authentication.service';
import * as faker from 'faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { RequestSigninDto } from '../dto/request-signin.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthenticationModule,
        UsersModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '01055646565',
          database: 'test',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          cache: false,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('User SignIn Validation Test', () => {
    it('정상적인 로그인', async () => {
      const existedUser = {
        username: 'llewyn',
        password: '1234',
      };
      const userProfile: RequestSigninDto = await service.validateUser(
        existedUser,
      );
      const token = await service.signin(userProfile);
      expect(token.access_token).toBeDefined();
    });

    it('존재하지 않는 유저로 로그인할 경우, NotFoundException 발생.', async () => {
      //const userId = faker.random.uuid();
      const signinUser = {
        username: faker.lorem.word(),
        password: faker.lorem.word(),
      };
      try {
        await service.validateUser(signinUser);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_USER);
      }
    });
  });

  describe('User SignUp Validation Test', () => {
    it('정상적인 회원가입', async () => {
      const signupUser = {
        username: faker.lorem.sentence(),
        password: faker.lorem.sentence(),
        type: 'admin',
      };
      const result = await service.signup(signupUser);
      expect(result).toBeUndefined();
    });

    it('이미 존재하는 유저가 회원가입을 할 경우, BadRequestException 발생', async () => {
      const signupUser = {
        username: 'llewyn',
        password: '1234',
        type: 'admin',
      };
      try {
        await service.signup(signupUser);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(ErrorMessages.SAME_USER_EXISTED);
      }
    });
  });
});
