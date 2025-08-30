import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  constructor() {
    console.log('HealthController loaded');
  }

  @Get()
  health() {
    console.log('HealthController loaded');
    return { status: 'ok' };
  }
}
