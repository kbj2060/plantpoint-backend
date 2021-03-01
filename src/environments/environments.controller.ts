import { Body, Controller, Get, Param } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { ResponseLastEnvironmentDto } from '../dto/response-last-environment.dto';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { CreateEnvDto } from '../dto/create-env.dto';
import {getEnvironmentSectionInTopic, getSectionInTopic} from '../utils/utils';
import { ReadTodayEnvironmentDto } from '../dto/read-today-environment.dto';

@Controller('environments')
export class EnvironmentsController {
  constructor(readonly environmentsService: EnvironmentsService) {}

  @Get('/read/last/:environmentSection')
  readLastEnvironment(
    @Param('environmentSection') environmentSection: string,
  ): Promise<ResponseLastEnvironmentDto> {
    return this.environmentsService.readLastEnvironment(environmentSection);
  }

  @Get('/read/history/:section/:environment')
  readTodayEnvironmentHistory(
    @Param('section') section: string,
    @Param('environment') environment: string,
  ) {
    const readTodayEnvironment: ReadTodayEnvironmentDto = {
      section : section,
      environmentName: environment,
    }
    return this.environmentsService.readTodayEnvironmentHistory( readTodayEnvironment );
  }

  @MessagePattern('env/section/+')
  getMqttEnvironment(@Payload() data: JSON, @Ctx() context: MqttContext) {
    const createEnvDto: CreateEnvDto = {
      environmentSection: getEnvironmentSectionInTopic(context.getTopic()),
      co2: data['co2'],
      temperature: data['temperature'],
      humidity: data['humidity'],
    };
    return this.environmentsService.createCurrentEnvironment(createEnvDto);
  }
}
