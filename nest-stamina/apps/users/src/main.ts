import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { CustomLogger } from 'lib/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'users',
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added more methods for user CRUD
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.startAllMicroservices();

  await app.listen(configService.get('USERS_PORT'));
}
bootstrap();
