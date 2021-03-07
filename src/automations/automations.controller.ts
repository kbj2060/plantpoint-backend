import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from '../dto/create-automation.dto';
import { ResponseLastAutomationDto } from '../dto/response-last-automation.dto';
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('automations')
export class AutomationsController {
  constructor(readonly automationsService: AutomationsService) {}

  @Get('/read/:section')
  @UseGuards(JwtAuthGuard)
  async readAutomation(
    @Param('section') section: string
  ): Promise<ResponseLastAutomationDto> {
    return await this.automationsService.readAutomation(section);
  }

  @Post('/create/:controlledBy')
  @UseGuards(JwtAuthGuard)
  createAutomation(
    @Body() automationCreateDto: Record<string, CreateAutomationDto>,
    @Param('controlledBy') controlledBy: string,
  ): Promise<void> {
    return this.automationsService.createAutomation(automationCreateDto, controlledBy);
  }
}
