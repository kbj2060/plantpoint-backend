import {Body, Controller, Get, Param, UseGuards} from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { ResponseLastEnvironmentDto } from '../dto/response-last-environment.dto';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { CreateEnvDto } from '../dto/create-env.dto';
import {getEnvironmentSectionInTopic} from '../utils/utils';
import { ReadTodayEnvironmentDto } from '../dto/read-today-environment.dto';
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('environments')
export class EnvironmentsController {
  constructor(readonly environmentsService: EnvironmentsService) {}

  @Get('/read/last/:environmentSection')
  @UseGuards(JwtAuthGuard)
  readLastEnvironment(
    @Param('environmentSection') environmentSection: string,
  ): Promise<ResponseLastEnvironmentDto> {
    return this.environmentsService.readLastEnvironment(environmentSection);
  }

  @Get('/read/history/:section/:environment')
  @UseGuards(JwtAuthGuard)
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

  @Get('/read/lastAll/:machineSection')
  @UseGuards(JwtAuthGuard)
  readLastAllEnvironments(
    @Param('machineSection') mSection: string,
  ) {
    return this.environmentsService.readLastAllEnvironments(mSection);
  }

  @MessagePattern('env/section/+')
  getMqttEnvironment(@Payload() data: JSON, @Ctx() context: MqttContext) {
	let filtered = JSON.parse(data.toString().replace(/\bNaN\b/g,"null"));
	  Object.keys(filtered).forEach((key) => {
	  	filtered[key] =  !data[key] ? 0 : data[key]
	  })
    const createEnvDto: CreateEnvDto = {
	environmentSection: getEnvironmentSectionInTopic(context.getTopic()),
	co2: filtered['co2'],
	temperature: filtered['temperature'],
	humidity: filtered['humidity'],
	};
    return this.environmentsService.createCurrentEnvironment(createEnvDto);
  }
}
