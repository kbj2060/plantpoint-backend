import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CreateAutomationDto } from '../src/dto/create-automation.dto';
import * as faker from 'faker';
import { CreateUserDto } from '../src/dto/create-user.dto';
import { SigninDto } from '../src/dto/signin.dto';
import { ReadCurrentDto } from '../src/dto/read-current';
import { ReadTodayEnvironmentDto } from '../src/dto/read-today-environment.dto';
import { ReadScheduleDto } from '../src/dto/read-schedule.dto';
import { DeleteScheduleDto } from '../src/dto/delete-schedule.dto';
import { UpdateScheduleDto } from '../src/dto/update-shedule.dto';
import { CreateScheduleDto } from '../src/dto/create-schedule.dto';
import { CreateSwitchDto } from '../src/dto/create-switch.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // decorator(@)가 없는 속성이 들어오면 해당 속성은 제거하고 받아들입니다.
        forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 넘어오면 request 자체를 막습니다.
        forbidUnknownValues: true,
        transform: true, // 클라이언트에서 값을 받자마자 타입을 정의한대로 자동 형변환을 합니다.
      }),
    );
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    });
    await app.startAllMicroservicesAsync();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('APP (e2e)', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Automation (e2e)', () => {
    it('/automations/read/:section (GET)', () => {
      const validSection = 's1';
      return request(app.getHttpServer())
        .get(`/automations/read/${validSection}`)
        .expect(200);
    });

    it('/automations/create (POST)', () => {
      const automationCreateDto: CreateAutomationDto = {
        machineSection: 's1',
        automationType: 'range',
        machine: 'cooler',
        start: ['10'],
        end: ['11'],
        term: 1,
        enable: true,
      };
      return request(app.getHttpServer())
        .post('/automations/create')
        .send(automationCreateDto)
        .expect(201);
    });
  });

  describe('Authentication (e2e)', () => {
    it('/authentication/signin (POST)', () => {
      const signinDto: SigninDto = {
        username: 'llewyn',
        password: '1234',
      };
      return request(app.getHttpServer())
        .post(`/authentication/signin`)
        .send(signinDto)
        .expect(201);
    });

    it('/authentication/signup (POST)', () => {
      const signupDto: CreateUserDto = {
        username: faker.lorem.word(),
        password: '1234',
        type: 'admin',
      };
      return request(app.getHttpServer())
        .post('/authentication/signup')
        .send(signupDto)
        .expect(201);
    });
  });

  describe('Current (e2e)', () => {
    it('/currents/read (GET)', () => {
      const currentReadDto: ReadCurrentDto = {
        machineSection: 's1',
        machine: 'cooler',
      };
      return request(app.getHttpServer())
        .get(`/currents/read`)
        .send(currentReadDto)
        .expect(200);
    });

    /* TODO : MQTT */
  });

  describe('Environment (e2e)', () => {
    it('/environments/read/last/:section (GET)', () => {
      const section = 's1-1';
      return request(app.getHttpServer())
        .get(`/environments/read/last/${section}`)
        .expect(200);
    });

    it('/environments/read/history (GET)', () => {
      const readTodayEnvironment: ReadTodayEnvironmentDto = {
        section: 'd1',
        environmentName: 'co2',
      };
      return request(app.getHttpServer())
        .get(`/environments/read/history`)
        .send(readTodayEnvironment)
        .expect(200);
    });

    /* TODO : MQTT */
  });

  describe('Schedule (e2e)', () => {
    it('/schedules/read (GET)', () => {
      const scheduleReadDto: ReadScheduleDto = {
        date: '2020-02-11',
      };
      return request(app.getHttpServer())
        .get(`/schedules/read`)
        .send(scheduleReadDto)
        .expect(200);
    });

    it('/schedules/create (POST)', () => {
      const scheduleCreateDto: CreateScheduleDto = {
        date: ['2020-02-12'],
        title: 'test',
        content: 'test',
        createdBy: 'llewyn',
      };
      return request(app.getHttpServer())
        .post(`/schedules/create`)
        .send(scheduleCreateDto)
        .expect(201);
    });

    it('/schedules/update (POST)', () => {
      const scheduleUpdateDto: UpdateScheduleDto = {
        id: 4,
        date: ['2020-02-12'],
        title: 'test1',
        content: 'test',
      };
      return request(app.getHttpServer())
        .post(`/schedules/update`)
        .send(scheduleUpdateDto)
        .expect(201);
    });

    it('/schedules/delete (POST)', () => {
      const scheduleDeleteDto: DeleteScheduleDto = {
        ids: [3],
      };
      return request(app.getHttpServer())
        .post(`/schedules/delete`)
        .send(scheduleDeleteDto)
        .expect(201);
    });
  });

  describe('Switch (e2e)', () => {
    it('/switches/read/:section (GET)', () => {
      const section = 's1';
      return request(app.getHttpServer())
        .get(`/switches/read/last/${section}`)
        .expect(200);
    });

    it('/switches/read/history/:section (GET)', () => {
      const section = 's1';
      return request(app.getHttpServer())
        .get(`/switches/read/history/${section}`)
        .expect(200);
    });

    it('/switches/create (POST)', () => {
      const switchesCreateDto: CreateSwitchDto = {
        machineSection: 's1',
        machine: 'cooler',
        status: 0,
        controlledBy: 'llewyn',
      };

      return request(app.getHttpServer())
        .post(`/switches/create`)
        .send(switchesCreateDto)
        .expect(201);
    });

    /* TODO : Mqtt */
  });
});
