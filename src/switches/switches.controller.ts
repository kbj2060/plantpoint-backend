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
    console.log("called")

    return this.switchesService.readLastSwitches(section);
  }

  @Get('/read/history/:section')
  @UseGuards(JwtAuthGuard)
  async readSwitchHistory (
    @Param('section') section: string,
  ): Promise<ResponseHistorySwitchDto> {
    return this.switchesService.readSwitchHistory(section);
  }

  /* TODO:
      * Automation 스크립트에서도 mqtt로 publish 하지말고 http /create 를 통해 db 저장과 mqtt를 한 번에 동작
  */
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
