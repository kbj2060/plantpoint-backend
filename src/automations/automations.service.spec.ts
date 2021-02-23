import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { Machine } from '../entities/machine.entity';
import { MachineSection } from '../entities/machine_section.entity';
import { Automation } from '../entities/automation.entity';
import { AutomationsModule } from './automations.module';
import { AutomationsService } from './automations.service';
import { ResponseLastAutomationDto } from '../dto/response-last-automation.dto';

describe('AutomationsService', () => {
  let service: AutomationsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AutomationsModule,
        UsersModule,
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
        TypeOrmModule.forFeature([Automation, Machine, MachineSection]),
      ],
    }).compile();
    service = module.get<AutomationsService>(AutomationsService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Automation Read Validation Test', () => {
    it('정상적인 Automation 데이터 읽기', async () => {
      const section = 's1';
      const automation = await service.readAutomation(section);
      expect(automation).toBeInstanceOf(ResponseLastAutomationDto);
    });

    it('존재하지 않는 Machine Section 에 접근하는 경우, NotFoundException 발생', async () => {
      const fakeSection = faker.lorem.word();
      try {
        await service.readAutomation(fakeSection);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });
  });

  describe('Automation Create Validation Test', () => {
    it('정상적인 Automation 데이터 쓰기', async () => {
      const createAutomationDto = {
        machineSection: 's1',
        controlledBy: 'llewyn',
        machine: 'cooler',
        start: ['10', '12'],
        end: ['11', '13'],
        term: 1,
        enable: true,
      };
      await service.createAutomation(createAutomationDto);
    });

    it('존재하지 않는 Machine Section 에 접근하려는 경우, NotFoundException 발생', async () => {
      const createAutomationDto = {
        machineSection: faker.lorem.word(),
        controlledBy: 'llewyn',
        machine: 'cooler',
        start: ['10', '12'],
        end: ['11', '13'],
        term: 1,
        enable: true,
      };
      try {
        await service.createAutomation(createAutomationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });

    it('존재하지 않는 User 에 접근하려는 경우, NotFoundException 발생', async () => {
      const createAutomationDto = {
        machineSection: 's1',
        controlledBy: faker.lorem.word(),
        machine: 'cooler',
        start: ['10', '12'],
        end: ['11', '13'],
        term: 1,
        enable: true,
      };
      try {
        await service.createAutomation(createAutomationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_USER);
      }
    });

    it('존재하지 않는 Machine 에 접근하려는 경우, NotFoundException 발생', async () => {
      const createAutomationDto = {
        machineSection: 's1',
        controlledBy: 'llewyn',
        machine: faker.lorem.word(),
        start: ['10', '12'],
        end: ['11', '13'],
        term: 1,
        enable: true,
      };
      try {
        await service.createAutomation(createAutomationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINE);
      }
    });
  });
});
