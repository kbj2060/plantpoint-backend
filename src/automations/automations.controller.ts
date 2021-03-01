import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from '../dto/create-automation.dto';
import { ResponseLastAutomationDto } from '../dto/response-last-automation.dto';

@Controller('automations')
export class AutomationsController {
  constructor(readonly automationsService: AutomationsService) {}

  @Get('/read/:section')
  async readAutomation(
    @Param('section') section: string,
  ): Promise<ResponseLastAutomationDto> {
    return await this.automationsService.readAutomation(section);
  }

  @Post('/create/:controlledBy')
  createAutomation(
    @Body() automationCreateDto: Record<string, CreateAutomationDto>,
    @Param('controlledBy') controlledBy: string,
  ): Promise<void> {
    return this.automationsService.createAutomation(automationCreateDto, controlledBy);
  }
}
