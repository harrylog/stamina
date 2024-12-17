import { NestFactory } from '@nestjs/core';
import { LearningModule } from './learning.module';

async function bootstrap() {
  const app = await NestFactory.create(LearningModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
