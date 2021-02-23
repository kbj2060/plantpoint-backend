import { Injectable } from '@nestjs/common';
import { Environment } from '../entities/environment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvDto } from '../dto/create-env.dto';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { ResponseLastEnvironmentDto } from '../dto/response-last-environment.dto';
import { ResponseEnvironmentHistoryDto } from '../dto/response-environment-history.dto';
import { getPresentDatetime } from '../utils/utils';
import {
  EnvironmentCreate,
  EnvironmentHistory,
  LastEnvironment,
} from '../interfaces/environments.interface';
import { DateFormat } from '../interfaces/constants';
import { EnvironmentSection } from '../entities/environment_section.entity';
import { checkEnvironmentSection } from '../utils/error-handler';
import { ReadTodayEnvironmentDto } from '../dto/read-today-environment.dto';

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private environmentsRepository: Repository<Environment>,
    @InjectRepository(EnvironmentSection)
    private environmentSectionRepository: Repository<EnvironmentSection>,
  ) {}

  async getSection(sectionName: string): Promise<EnvironmentSection> {
    return await this.environmentSectionRepository.findOne({
      environmentSection: sectionName,
    });
  }

  async readLastEnvironment(
    section: string,
  ): Promise<ResponseLastEnvironmentDto> {
    const environmentSection: EnvironmentSection = await this.getSection(
      section,
    );
    checkEnvironmentSection(environmentSection);

    const lastEnvironment: LastEnvironment = await this.environmentsRepository
      .createQueryBuilder('environment')
      .leftJoinAndSelect('environment.environmentSection', 'environmentSection')
      .select([
        'environment.co2',
        'environment.humidity',
        'environment.temperature',
      ])
      .where('environmentSection.environmentSection = :section', { section })
      .orderBy('environment.id', 'DESC')
      .getOne();

    if (!lastEnvironment) {
      return new ResponseLastEnvironmentDto();
    }

    return plainToClass(ResponseLastEnvironmentDto, lastEnvironment);
  }

  async readTodayEnvironmentHistory(
    readTodayEnvironment: ReadTodayEnvironmentDto,
  ): Promise<ResponseEnvironmentHistoryDto> {
    const environmentSection: EnvironmentSection = await this.getSection(
      readTodayEnvironment.environmentSection,
    );
    checkEnvironmentSection(environmentSection);

    const startAt = moment(new Date()).format(DateFormat.DAY_FORMAT);
    const endAt = getPresentDatetime();
    const environmentsHistory: EnvironmentHistory[] = await this.environmentsRepository
      .createQueryBuilder('environment')
      .leftJoinAndSelect('environment.environmentSection', 'environmentSection')
      .select([
        `environment.${readTodayEnvironment.environmentName} AS ${readTodayEnvironment.environmentName}`,
        'environmentSection.environmentSection AS environmentSection',
        'environment.created AS created',
      ])
      .where('environment.created >= :startAt', { startAt })
      .andWhere('environment.created <= :endAt', { endAt })
      .andWhere('environmentSection LIKE :section', {
        section: '%' + readTodayEnvironment.environmentSection + '%',
      })
      .orderBy('environment.id', 'DESC')
      .getRawMany();
    return plainToClass(ResponseEnvironmentHistoryDto, {
      histories: environmentsHistory,
    });
  }

  async createCurrentEnvironment(environmentCreateDto: CreateEnvDto) {
    const section: EnvironmentSection = await this.getSection(
      environmentCreateDto.environmentSection,
    );
    checkEnvironmentSection(section);

    const environment: EnvironmentCreate = {
      ...environmentCreateDto,
      environmentSection: section,
    };
    await this.environmentsRepository.save(
      plainToClass(Environment, environment),
    );
  }
}
