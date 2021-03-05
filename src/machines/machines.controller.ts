import {Controller, Get, Param} from '@nestjs/common';
import {MachinesService} from "./machines.service";
import {ResponseMachineDto} from "../dto/response-machine-dto";

@Controller('machines')
export class MachinesController {

  constructor(readonly machinesService: MachinesService) {}

  @Get('/read/:section')
  async readLastSwitches(
    @Param('section') section: string,
  ): Promise<ResponseMachineDto[]> {
    return this.machinesService.readMachines(section);
  }
}

