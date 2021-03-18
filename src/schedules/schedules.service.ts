import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { ReadScheduleDto } from '../dto/read-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-shedule.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { DeleteScheduleDto } from '../dto/delete-schedule.dto';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { User } from '../entities/user.entity';
import { DateFormat, ErrorMessages } from '../interfaces/constants';
import {
  ScheduleCreate,
  SelectedDateSchedule,
} from '../interfaces/schedules.interface';
import { ResponseSchedulesDto } from '../dto/response-schedules.dto';
import { checkSchedule, checkUser } from '../utils/error-handler';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

const checkDateFormat = (date: string, dateFormat: string): boolean => {
  return moment(date, dateFormat, true).isValid();
};

const getDateFormat = (date: string): string => {
  if (checkDateFormat(date, DateFormat.DAY_FORMAT)) {
    return DateFormat.DAY_FORMAT;
  } else if (checkDateFormat(date, DateFormat.MONTH_FORMAT)) {
    return DateFormat.MONTH_FORMAT;
  } else {
    throw new TypeError(ErrorMessages.NOT_RIGHT_DATE_FORMAT);
  }
};

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async findScheduleById(id: number): Promise<Schedule> {
    return await this.schedulesRepository.findOne({ id: id });
  }
  async getUser(username: string) {
    return await this.usersRepository.findOne({ username: username });
  }

  async readSchedule(
    scheduleReadDto: ReadScheduleDto,
  ): Promise<ResponseSchedulesDto> {
    const dateFormat: string = getDateFormat(scheduleReadDto.date);
    const formattedDate: string = moment(new Date(scheduleReadDto.date)).format(dateFormat);

    const schedules: SelectedDateSchedule[] = await this.schedulesRepository
      .createQueryBuilder('schedule')
      .select([
        'schedule.id',
        'schedule.date',
        'schedule.title',
        'schedule.content',
        'schedule.binding',
      ])
      .where('schedule.date LIKE :date', { date: `%${formattedDate}%` })
      .orderBy('schedule.date', 'DESC')
      .getMany();

    this.logger.info(`${scheduleReadDto.date} Schedule Data Loaded`);
    return plainToClass(ResponseSchedulesDto, {
      SelectedDateSchedules: schedules,
    });
  }

  async deleteSchedule(scheduleDeleteDto: DeleteScheduleDto): Promise<void> {
    this.logger.info(`Schedules Data Deleted`);
    await this.schedulesRepository.delete(scheduleDeleteDto.ids);
  }

  async updateSchedule(scheduleUpdateDto: UpdateScheduleDto): Promise<void> {
    this.logger.info(`${scheduleUpdateDto.id} Schedule Data Updated`);
    const findingSchedule: Schedule = await this.findScheduleById(
      scheduleUpdateDto.id,
    );

    checkSchedule(findingSchedule);

    await this.schedulesRepository
      .createQueryBuilder('schedule')
      .update('schedule')
      .where('id = :id', { id: scheduleUpdateDto.id })
      .set(plainToClass(Schedule, scheduleUpdateDto))
      .execute();
  }

  async createSchedule(scheduleCreateDto: CreateScheduleDto): Promise<void> {
    const user: User = await this.getUser(scheduleCreateDto.createdBy);
    checkUser(user);

    const schedule: ScheduleCreate = {
      ...scheduleCreateDto,
      createdBy: user,
    };

    this.logger.info(`${scheduleCreateDto.title} Schedule Data Created`);
    await this.schedulesRepository.save(plainToClass(Schedule, schedule));
  }
}
