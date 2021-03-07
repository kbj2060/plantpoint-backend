import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { CreateSwitchDto } from '../dto/create-switch.dto';
import { SwitchesService } from './switches.service';
import { ResponseHistorySwitchDto } from '../dto/response-history-switch.dto';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import {PowerOnSwitch} from "../interfaces/switches.interface";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('switches')
export class SwitchesController {
  constructor(readonly switchesService: SwitchesService) {}

  @Get('/read/last/:section')
  @UseGuards(JwtAuthGuard)
  async readLastSwitches (
    @Param('section') section: string,
  ): Promise<PowerOnSwitch[]> {
    return this.switchesService.readLastSwitches(section);
  }

  @Get('/read/history/:section')
  @UseGuards(JwtAuthGuard)
  async readSwitchHistory (
    @Param('section') section: string,
  ): Promise<ResponseHistorySwitchDto> {
    return this.switchesService.readSwitchHistory(section);
  }

  /* 텔레그램 알림 추가할 것. */
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createSwitch (@Body() switchCreateDto: CreateSwitchDto): Promise<void> {
    return this.switchesService.createSwitch(switchCreateDto);
  }

  @MessagePattern('switch/+/+')
  getMqttSwitch(@Payload() data: number, @Ctx() context: MqttContext) {
    //TODO: socket.io 통신 컨트롤 추가하고 테스트에도 추가할 것.
  }
}
