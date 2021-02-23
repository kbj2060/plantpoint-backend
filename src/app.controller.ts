import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  homepage() {
    return 'Hello World!';
  }
}
