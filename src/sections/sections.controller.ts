import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {SectionsService} from "./sections.service";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('sections')
export class SectionsController {
  constructor(readonly sectionsService: SectionsService) {}

  @Get('/read/:m_section')
  @UseGuards(JwtAuthGuard)
  async readEnvironmentSections(
    @Param('m_section') m_section: string,
  ){
    return this.sectionsService.readEnvironmentSections(m_section);
  }
}
