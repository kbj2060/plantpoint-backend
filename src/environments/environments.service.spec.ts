import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsModule } from './environments.module';
import { Environment } from '../entities/environment.entity';
import { ResponseLastEnvironmentDto } from '../dto/response-last-environment.dto';
import { ReadTodayEnvironmentDto } from '../dto/read-today-environment.dto';
import { CreateEnvDto } from '../dto/create-env.dto';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        EnvironmentsModule,
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
        TypeOrmModule.forFeature([Environment]),
      ],
    }).compile();
    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Last Environment Read Validation Test', () => {
    it('정상적인 Last Environment 데이터 읽기', async () => {
      /* 데이터가 없을 경우, 모두 0으로 처리 */
      const section = 's1-1';
      const environment = await service.readLastEnvironment(section);
      expect(environment).toBeInstanceOf(ResponseLastEnvironmentDto);
    });

    it('존재하지 않는 Environment Section 에 접근하는 경우, NotFoundException 발생', async () => {
      const fakeSection = faker.lorem.word();
      try {
        await service.readLastEnvironment(fakeSection);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_ENVIRONMENTSECTION);
      }
    });
  });

  describe('Today Environment Read Validation Test', () => {
    it('정상적인 Today Environment 데이터 읽기', async () => {
      const readTodayEnvironmentDto: ReadTodayEnvironmentDto = {
        environmentSection: 's1-1',
        environmentName: 'co2',
      };
      await service.readTodayEnvironmentHistory(readTodayEnvironmentDto);
    });

    it('존재하지 않는 Environment Section 에 접근하는 경우, NotFoundException 발생', async () => {
      const readTodayEnvironmentDto: ReadTodayEnvironmentDto = {
        environmentSection: faker.lorem.word(),
        environmentName: 'co2',
      };
      try {
        await service.readTodayEnvironmentHistory(readTodayEnvironmentDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_ENVIRONMENTSECTION);
      }
    });
  });

  describe('Environment Create Validation Test', () => {
    it('정상적인 Environment 데이터 쓰기', async () => {
      const environmentCreateDto: CreateEnvDto = {
        environmentSection: 's1-1',
        co2: 1.2,
        humidity: 1.2,
        temperature: 4.2,
      };
      await service.createCurrentEnvironment(environmentCreateDto);
    });

    it('존재하지 않는 Environment Section 에 접근하는 경우, NotFoundException 발생', async () => {
      const environmentCreateDto: CreateEnvDto = {
        environmentSection: faker.lorem.word(),
        co2: 1.2,
        humidity: 1.2,
        temperature: 4.2,
      };
      try {
        await service.createCurrentEnvironment(environmentCreateDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_ENVIRONMENTSECTION);
      }
    });
  });
});
