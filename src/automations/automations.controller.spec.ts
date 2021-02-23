import { Test } from '@nestjs/testing';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { ResponseLastAutomationDto } from '../dto/response-last-automation.dto';
import { AutomationsModule } from './automations.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Automation } from '../entities/automation.entity';
import { Machine } from '../entities/machine.entity';
import { MachineSection } from '../entities/machine_section.entity';

describe('CatsController', () => {
  let autoController: AutomationsController;
  let autoService: AutomationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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

    autoService = moduleRef.get<AutomationsService>(AutomationsService);
    autoController = moduleRef.get<AutomationsController>(
      AutomationsController,
    );
  });

  describe('Read automations of selected section', () => {
    it('should return an array of LastAutomation class', async () => {
      const result: Promise<ResponseLastAutomationDto> = Promise.resolve(
        new ResponseLastAutomationDto(),
      );
      const param = 's1';
      jest
        .spyOn(autoService, 'readAutomation')
        .mockImplementation(() => result);

      expect(await autoController.readAutomation(param)).toBeInstanceOf(
        ResponseLastAutomationDto,
      );
    });
  });
});
