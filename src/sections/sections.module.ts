import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EnvironmentSection} from "../entities/environment_section.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentSection])],
  controllers: [SectionsController],
  providers: [SectionsService]
})
export class SectionsModule {}
