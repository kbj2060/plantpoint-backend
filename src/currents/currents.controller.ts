import {Body, Controller, Get, Param} from '@nestjs/common';
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
import { ReadAllCurrentDto } from '../dto/read-all-current';

@Controller('currents')
export class CurrentsController {
  constructor(readonly currentsService: CurrentsService) {}

  @Get('/read/:machineSection/:machine')
  readCurrent(
    @Param('machine') machine: string,
    @Param('machineSection') machineSection: string,
  ): Promise<ResponseLastCurrentDto> {
    const currentReadDto: ReadCurrentDto = {
      machine: machine,
      machineSection: machineSection,
    }
    return this.currentsService.readCurrent(currentReadDto);
  }

  @Get('/read/:machineSection')
  readAllCurrent(
    @Param('machineSection') machineSection: string,
  ) {
    const readAllCurrentDto: ReadAllCurrentDto = { machineSection: machineSection };
    return this.currentsService.readAllCurrent(readAllCurrentDto);
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
