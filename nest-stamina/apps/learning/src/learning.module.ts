import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

@Module({
  imports: [],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
