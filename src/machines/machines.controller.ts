import {Controller, Get, Param, Req, Request, UseGuards} from '@nestjs/common';
import {MachinesService} from "./machines.service";
import {ResponseMachineDto} from "../dto/response-machine-dto";
import {JwtAuthGuard} from "../authentication/jwt-auth.guard";

@Controller('machines')
export class MachinesController {

  constructor(readonly machinesService: MachinesService) {}

  @Get('/read/:section')
  @UseGuards(JwtAuthGuard)
  async readLastSwitches(
    @Param('section') section: string, @Req() req: any,
  ): Promise<ResponseMachineDto[]> {
    return this.machinesService.readMachines(section);
  }
}

