import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ReadScheduleDto } from '../dto/read-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-shedule.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { DeleteScheduleDto } from '../dto/delete-schedule.dto';
import { ResponseSchedulesDto } from '../dto/response-schedules.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(readonly schedulesService: SchedulesService) {}

  @Get('/read')
  readSchedule(
    @Body() scheduleReadDto: ReadScheduleDto,
  ): Promise<ResponseSchedulesDto> {
    return this.schedulesService.readSchedule(scheduleReadDto);
  }

  @Post('/delete')
  deleteSchedule(@Body() scheduleDeleteDto: DeleteScheduleDto): Promise<void> {
    return this.schedulesService.deleteSchedule(scheduleDeleteDto);
  }

  @Post('/update')
  updateSchedule(@Body() scheduleUpdateDto: UpdateScheduleDto): Promise<void> {
    return this.schedulesService.updateSchedule(scheduleUpdateDto);
  }

  @Post('/create')
  createSchedule(@Body() scheduleCreateDto: CreateScheduleDto): Promise<void> {
    return this.schedulesService.createSchedule(scheduleCreateDto);
  }
}
