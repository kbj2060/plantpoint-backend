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
import {Machine} from "../entities/machine.entity";
import {MachineSection} from "../entities/machine_section.entity";

const flattenSections = (sections) => {
  return sections.map((m)=>Object.values(m)[0])
}

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private environmentsRepository: Repository<Environment>,
    @InjectRepository(EnvironmentSection)
    private environmentSectionRepository: Repository<EnvironmentSection>,
  ) {}

  async readLastAllEnvironments( mSection: string ) {
    const eSections = await this.environmentSectionRepository
      .createQueryBuilder('environmentSection')
      .select('environmentSection.environmentSection')
      .where(`section = :section`, {section: mSection})
      .getMany();

    const lastAllEnvironments = []
    for (const eSection of flattenSections(eSections) ) {
      lastAllEnvironments.push(
        await this.environmentsRepository
          .createQueryBuilder('environment')
          .leftJoinAndSelect('environment.environmentSection', 'environmentSection')
          .select([
            'environment.co2 as co2',
            'environment.humidity as humidity',
            'environment.temperature as temperature',
            'environmentSection.environmentSection as section'
          ])
          .where('environmentSection.environmentSection = :section', { section: eSection })
          .orderBy('environment.id', 'DESC')
          .getRawOne()
      )
    }
    return plainToClass(ResponseLastEnvironmentDto, lastAllEnvironments);
  }

    async getEnvironmentSection(sectionName: string): Promise<EnvironmentSection> {
    return await this.environmentSectionRepository.findOne({
      environmentSection: sectionName,
    });
  }

  async getSection(sectionName: string): Promise<EnvironmentSection> {
    return await this.environmentSectionRepository.findOne({
      section: sectionName,
    });
  }

  async readLastEnvironment( eSection: string ): Promise<ResponseLastEnvironmentDto> {
    const [ environmentSection, lastEnvironment ]: [ EnvironmentSection, LastEnvironment ] = await Promise.all([
      await this.getEnvironmentSection( eSection ),
      await this.environmentsRepository
        .createQueryBuilder('environment')
        .leftJoinAndSelect('environment.environmentSection', 'environmentSection')
        .select([
          'environment.co2',
          'environment.humidity',
          'environment.temperature',
        ])
        .where('environmentSection.environmentSection = :section', { section: eSection })
        .orderBy('environment.id', 'DESC')
        .getOne()
    ])
    checkEnvironmentSection(environmentSection);

    if (!lastEnvironment) { return new ResponseLastEnvironmentDto(); }

    return plainToClass(ResponseLastEnvironmentDto, lastEnvironment);
  }

  async readTodayEnvironmentHistory(
    readTodayEnvironment: ReadTodayEnvironmentDto,
  ): Promise<ResponseEnvironmentHistoryDto> {
    const startAt = moment(new Date()).format(DateFormat.DAY_FORMAT);
    const endAt = getPresentDatetime();

    const [ environmentSection, environmentsHistory ]: [ EnvironmentSection, EnvironmentHistory[] ] = await Promise.all([
      await this.getSection( readTodayEnvironment.section ),
      await this.environmentsRepository
        .createQueryBuilder('environment')
        .leftJoinAndSelect('environment.environmentSection', 'environmentSection')
        .select([
          `environment.${readTodayEnvironment.environmentName} AS ${readTodayEnvironment.environmentName}`,
          'environmentSection.environmentSection AS environmentSection',
          'environment.created AS created',
        ])
        .where('environment.created >= :startAt', { startAt })
        .andWhere('environment.created <= :endAt', { endAt })
        .andWhere('environmentSection.section = :section', {
          section: readTodayEnvironment.section,
        })
        .orderBy('environment.id', 'DESC')
        .getRawMany()
    ])

    checkEnvironmentSection(environmentSection);

    return plainToClass(ResponseEnvironmentHistoryDto, {
      histories: environmentsHistory,
    });
  }

  async createCurrentEnvironment(environmentCreateDto: CreateEnvDto) {
    const section: EnvironmentSection = await this.getEnvironmentSection(
      environmentCreateDto.environmentSection,
    );

    checkEnvironmentSection(section);

    await this.environmentsRepository.save(
      plainToClass(Environment, {
        ...environmentCreateDto,
        environmentSection: section,
      } as EnvironmentCreate),
    );
  }
}
