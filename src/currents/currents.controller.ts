import { Body, Controller, Get } from '@nestjs/common';
import { CreateCurrentDto } from '../dto/create-current.dto';
import { CurrentsService } from './currents.service';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { getMachineInTopic, getSectionInTopic } from '../utils/utils';
import { ReadCurrentDto } from '../dto/read-current';
import { ResponseLastCurrentDto } from '../dto/response-last-current.dto';

@Controller('currents')
export class CurrentsController {
  constructor(readonly currentsService: CurrentsService) {}

  @Get('/read')
  readCurrent(
    @Body() currentFindDto: ReadCurrentDto,
  ): Promise<ResponseLastCurrentDto> {
    return this.currentsService.readCurrent(currentFindDto);
  }

  @MessagePattern('current/+/+')
  getMqttCurrent(
    @Payload() data: number,
    @Ctx() context: MqttContext,
  ): Promise<void> {
    const createCurrentDto = {
      machineSection: getSectionInTopic(context.getTopic()),
      machine: getMachineInTopic(context.getTopic()),
      current: data,
    };
    return this.currentsService.createCurrent(
      plainToClass(CreateCurrentDto, createCurrentDto),
    );
  }
}
