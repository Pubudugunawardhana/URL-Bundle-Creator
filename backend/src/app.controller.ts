import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Vercel Serverless Function is awake and running.',
      timestamp: new Date().toISOString(),
    };
  }
}
