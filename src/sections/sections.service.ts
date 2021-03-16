import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EnvironmentSection} from "../entities/environment_section.entity";

@Injectable()
export class SectionsService {
  constructor (
    @InjectRepository(EnvironmentSection)
    private environmentSectionRepository: Repository<EnvironmentSection>,
  ) {}
  async readEnvironmentSections (m_section: string) {
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
