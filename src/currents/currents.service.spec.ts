import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../interfaces/constants';
import { Machine } from '../entities/machine.entity';
import { MachineSection } from '../entities/machine_section.entity';
import { CurrentsService } from './currents.service';
import { CurrentsModule } from './currents.module';
import { Current } from '../entities/current.entity';
import { ReadCurrentDto } from '../dto/read-current';
import { ResponseLastCurrentDto } from '../dto/response-last-current.dto';

describe('CurrentsService', () => {
  let service: CurrentsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CurrentsModule,
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
        TypeOrmModule.forFeature([Current, MachineSection, Machine]),
      ],
    }).compile();
    service = module.get<CurrentsService>(CurrentsService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Current Read Validation Test', () => {
    it('정상적인 Current 데이터 읽기', async () => {
      const currentReadDto: ReadCurrentDto = {
        machine: 'cooler',
        machineSection: 's1',
      };
      const automation = await service.readCurrent(currentReadDto);
      expect(automation).toBeInstanceOf(ResponseLastCurrentDto);
    });

    it('존재하지 않는 Machine 에 접근하는 경우, NotFoundException 발생', async () => {
      const currentReadDto: ReadCurrentDto = {
        machine: faker.lorem.word(),
        machineSection: 's1',
      };
      try {
        await service.readCurrent(currentReadDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINE);
      }
    });

    it('존재하지 않는 Machine Section 에 접근하는 경우, NotFoundException 발생', async () => {
      const currentReadDto: ReadCurrentDto = {
        machine: 'cooler',
        machineSection: faker.lorem.word(),
      };
      try {
        await service.readCurrent(currentReadDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });
  });

  describe('Current Create Validation Test', () => {
    it('정상적인 Current 데이터 쓰기', async () => {
      const createAutomationDto = {
        machineSection: 's1',
        current: 1.2,
        machine: 'cooler',
      };
      await service.createCurrent(createAutomationDto);
    });

    it('존재하지 않는 Machine Section 에 접근하려는 경우, NotFoundException 발생', async () => {
      const createAutomationDto = {
        machineSection: faker.lorem.word(),
        current: 1.2,
        machine: 'cooler',
      };
      try {
        await service.createCurrent(createAutomationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });

    it('존재하지 않는 Machine 에 접근하려는 경우, NotFoundException 발생', async () => {
      const createAutomationDto = {
        machineSection: 's1',
        current: 1.2,
        machine: faker.lorem.word(),
      };
      try {
        await service.createCurrent(createAutomationDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINE);
      }
    });
  });
});
