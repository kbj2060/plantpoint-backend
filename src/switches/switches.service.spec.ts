import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages, MachineStatus } from '../interfaces/constants';
import { SwitchesService } from './switches.service';
import { SwitchesModule } from './switches.module';
import { Switch } from '../entities/switch.entity';
import { ResponseLastSwitchDto } from '../dto/response-last-switch.dto';
import { CreateSwitchDto } from '../dto/create-switch.dto';
import { ResponseHistorySwitchDto } from '../dto/response-history-switch.dto';

describe('SwitchesService', () => {
  let service: SwitchesService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        SwitchesModule,
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
        TypeOrmModule.forFeature([Switch]),
      ],
    }).compile();
    service = module.get<SwitchesService>(SwitchesService);
  });

  afterAll(() => {
    module.close();
  });

  describe('Service Load Test', () => {
    it('서비스가 로드됐는지 확인.', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Last Switches Read Validation Test', () => {
    it('정상적인 Last Switches 데이터 읽기', async () => {
      const section = 's1';
      const switches = await service.readLastSwitches(section);
      expect(switches).toBeInstanceOf(ResponseLastSwitchDto);
    });

    it('존재하지 않는 Machine Section 에 접근한 경우, NotFoundException 발생', async () => {
      const fakeSection = faker.lorem.word();
      try {
        await service.readLastSwitches(fakeSection);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });

    // TODO : need null exception & think aboud mock database
    it('Switch 데이터가 없는 경우, Null이 아닌 Switch의 기본값을 보냄', async () => {
      const section = 's1';
      // try {
      //   await service.readLastSwitches(section);
      // } catch (e) {
      //   expect(e).toBeInstanceOf(NotFoundException);
      //   expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      // }
    });
  });
  
  describe('Current Switches Read Validation Test', () => {
    it('정상적인 Switches 데이터 읽기', async () => {
      const section = 's1';
      const switches = await service.readLastSwitches(section);
      expect(switches).toBeInstanceOf(ResponseLastSwitchDto);
    });

    it('존재하지 않는 Machine Section 에 접근한 경우, NotFoundException 발생', async () => {
      const fakeSection = faker.lorem.word();
      try {
        await service.readLastSwitches(fakeSection);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });
  });

  describe('Switches History Read Validation Test', () => {
    it('정상적인 Switches History 데이터 읽기', async () => {
      const section = 's1';
      const switches = await service.readSwitchHistory(section);
      expect(switches).toBeInstanceOf(ResponseHistorySwitchDto);
    });

    it('존재하지 않는 Machine Section 에 접근한 경우, NotFoundException 발생', async () => {
      const fakeSection = faker.lorem.word();
      try {
        await service.readSwitchHistory(fakeSection);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });
  });

  describe('Switches Create Validation Test', () => {
    it('정상적인 Switches 데이터 쓰기', async () => {
      const switchCreateDto: CreateSwitchDto = {
        machineSection: 's1',
        machine: 'cooler',
        status: MachineStatus.ON,
        controlledBy: 'llewyn',
      };
      await service.createSwitch(switchCreateDto);
    });

    it('존재하지 않는 Machine Section 에 접근한 경우, NotFoundException 발생', async () => {
      const switchCreateDto: CreateSwitchDto = {
        machineSection: faker.lorem.word(),
        machine: 'cooler',
        status: MachineStatus.ON,
        controlledBy: 'llewyn',
      };
      try {
        await service.createSwitch(switchCreateDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_MACHINESECTION);
      }
    });

    it('존재하지 않는 유저가 접근한 경우, NotFoundException 발생', async () => {
      const switchCreateDto: CreateSwitchDto = {
        machineSection: 's1',
        machine: 'cooler',
        status: MachineStatus.ON,
        controlledBy: faker.lorem.word(),
      };
      try {
        await service.createSwitch(switchCreateDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(ErrorMessages.NOT_FOUND_USER);
      }
    });
  });
});
