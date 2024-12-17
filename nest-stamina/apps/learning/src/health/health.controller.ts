import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async checkHealth() {
    const port = this.configService.get('LEARNING_PORT');
    return {
      status: 'ok',
      service: 'learning',
      port,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('config')
  async checkConfig() {
    return {
      mongodb: !!this.configService.get('MONGODB_URI'),
      rabbitmq: !!this.configService.get('RABBITMQ_URI'),
      port: !!this.configService.get('LEARNING_PORT'),
      timestamp: new Date().toISOString(),
    };
  }
}

//curl http://localhost:3003/health/config
//curl http://localhost:3003/health
