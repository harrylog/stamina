import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProgressRepository } from './progress.repository';
import { CreateProgressDto, UpdateUnitProgressDto } from 'lib/common';

@Injectable()
export class ProgressService {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async initializeProgress(createProgressDto: CreateProgressDto) {
    const progress = {
      userId: new Types.ObjectId(createProgressDto.userId),
      courseId: new Types.ObjectId(createProgressDto.courseId),
      unitProgress: [],
      currentStreak: 0,
      lastActivityAt: new Date(),
    };
    return await this.progressRepository.create(progress as any);
  }

  async updateUnitProgress(
    userId: string,
    courseId: string,
    updateDto: UpdateUnitProgressDto,
  ) {
    const questionAttempts = updateDto.questionAttempts.map((qa) => ({
      questionId: new Types.ObjectId(qa.questionId),
      score: qa.score,
      isCorrect: qa.isCorrect,
    }));

    const updatedProgress =
      await this.progressRepository.findOneAndUpdateUnitProgress(
        new Types.ObjectId(userId),
        new Types.ObjectId(courseId),
        new Types.ObjectId(updateDto.unitId),
        questionAttempts,
      );

    if (!updatedProgress) {
      throw new NotFoundException('Progress record not found');
    }

    return updatedProgress;
  }

  async getUserCourseProgress(userId: string, courseId: string) {
    const progress = await this.progressRepository.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!progress) {
      throw new NotFoundException('Progress record not found');
    }

    return progress;
  }

  async getUnitCompletion(userId: string, courseId: string, unitId: string) {
    const progress = await this.getUserCourseProgress(userId, courseId);
    return progress.isUnitCompleted(unitId);
  }

  async checkUnitUnlock(
    userId: string,
    courseId: string,
    unitId: string,
    prerequisiteUnitId: string,
  ) {
    const progress = await this.getUserCourseProgress(userId, courseId);
    return progress.canUnlockUnit(unitId, prerequisiteUnitId);
  }

  async getProgress(userId: string) {
    return await this.progressRepository.find({
      userId: new Types.ObjectId(userId),
    });
  }

  async getCurrentStreak(userId: string) {
    const progresses = await this.progressRepository.find({
      userId: new Types.ObjectId(userId),
    });

    return Math.max(...progresses.map((p) => p.currentStreak), 0);
  }
}
