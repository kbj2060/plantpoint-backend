import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { SchedulesService } from './schedules.service';
import { SchedulesModule } from './schedules.module';
import { Schedule } from '../entities/schedule.entity';
import { ResponseSchedulesDto } from '../dto/response-schedules.dto';
import { DeleteScheduleDto } from '../dto/delete-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-shedule.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        SchedulesModule,
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
        TypeOrmModule.forFeature([Schedule]),
      ],
    }).compile();
    service = module.get<SchedulesService>(SchedulesService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Schedule Read Validation Test', () => {
    it('정상적인 Schedule 데이터 읽기', async () => {
      const scheduleReadDto = { date: '2020-02-11' };
      const schedule = await service.readSchedule(scheduleReadDto);
      expect(schedule).toBeInstanceOf(ResponseSchedulesDto);
    });

    it('날짜 형식이 다를 경우, TypeError 발생', async () => {
      const fakeDate = { date: faker.date.soon() };
      try {
        await service.readSchedule(fakeDate);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(ErrorMessages.NOT_RIGHT_DATE_FORMAT);
      }
    });
  });

  describe('Schedule Delete Validation Test', () => {
    it('정상적인 Schedule 데이터 지우기', async () => {
      const deleteIds: DeleteScheduleDto = {
        ids: [1],
      };
      await service.deleteSchedule(deleteIds);
    });
  });

  describe('Schedule Update Validation Test', () => {
    it('정상적인 Schedule 데이터 수정하기', async () => {
      const updateScheduleDto: UpdateScheduleDto = {
        id: 3,
        date: ['2020-02-11'],
        title: 'sfaaf',
        content: 'asdfasdf',
      };
      await service.updateSchedule(updateScheduleDto);
    });

    it('수정할 Schedule id 가 없는 경우, ', async () => {
      const updateScheduleDto: UpdateScheduleDto = {
        id: 1,
        date: ['2020-02-11'],
        title: 'sfaaf',
        content: 'asdfasdf',
      };
      try {
        await service.updateSchedule(updateScheduleDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_SCHEDULE);
      }
    });
  });

  describe('Schedule Create Validation Test', () => {
    it('정상적인 Schedule 데이터 쓰기', async () => {
      const scheduleCreateDto: CreateScheduleDto = {
        date: ['2020-02-11', '2020-02-12'],
        title: '1.2',
        content: '1.2',
        createdBy: 'llewyn',
      };
      await service.createSchedule(scheduleCreateDto);
    });

    it('존재하지 않는 유저가 접근하는 경우, NotFoundException 발생', async () => {
      const scheduleCreateDto: CreateScheduleDto = {
        date: ['2020-02-11', '2020-02-12'],
        title: '1.2',
        content: '1.2',
        createdBy: faker.lorem.word(),
      };
      try {
        await service.createSchedule(scheduleCreateDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_USER);
      }
    });
  });
});
