import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EnvironmentSection} from "../entities/environment_section.entity";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

@Injectable()
export class SectionsService {
  constructor (
    @InjectRepository(EnvironmentSection)
    private environmentSectionRepository: Repository<EnvironmentSection>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async readEnvironmentSections (m_section: string) {
    this.logger.info(`${m_section} Section's Environment Sections are Loaded`);
    return this.environmentSectionRepository
      .createQueryBuilder('environment_section')
      .select([
        'environment_section.environmentSection as e_section',
        'environment_section.section as m_section',
      ])
      .where('section = :section', {section: m_section})
      .getRawMany()
  }
}
