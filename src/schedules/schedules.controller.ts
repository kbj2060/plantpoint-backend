import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ReadScheduleDto } from '../dto/read-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-shedule.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { DeleteScheduleDto } from '../dto/delete-schedule.dto';
import { ResponseSchedulesDto } from '../dto/response-schedules.dto';
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('schedules')
export class SchedulesController {
  constructor(readonly schedulesService: SchedulesService) {}

  @Get('/read/:date')
  @UseGuards(JwtAuthGuard)
  readSchedule(
    @Param('date') date: string,
  ): Promise<ResponseSchedulesDto> {
    const scheduleReadDto: ReadScheduleDto = { date: date, }
    return this.schedulesService.readSchedule(scheduleReadDto);
  }

  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  deleteSchedule(@Body() scheduleDeleteDto: DeleteScheduleDto): Promise<void> {
    return this.schedulesService.deleteSchedule(scheduleDeleteDto);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  updateSchedule(@Body() scheduleUpdateDto: UpdateScheduleDto): Promise<void> {
    return this.schedulesService.updateSchedule(scheduleUpdateDto);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createSchedule(@Body() scheduleCreateDto: CreateScheduleDto): Promise<void> {
    return this.schedulesService.createSchedule(scheduleCreateDto);
  }
}
