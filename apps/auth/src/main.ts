// apps/auth/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { CustomLogger } from 'lib/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'auth',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_PORT'));
}
bootstrap();
