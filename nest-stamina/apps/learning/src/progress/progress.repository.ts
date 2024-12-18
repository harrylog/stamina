import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, ProgressDocument } from 'lib/common';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class ProgressRepository extends AbstractRepository<ProgressDocument> {
  protected readonly logger = new Logger(ProgressRepository.name);

  constructor(
    @InjectModel(ProgressDocument.name)
    progressModel: Model<ProgressDocument>,
  ) {
    super(progressModel);
  }

  async find(filterQuery: FilterQuery<ProgressDocument>) {
    return this.model.find(filterQuery).lean<ProgressDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<ProgressDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }

  async findOneAndUpdateUnitProgress(
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
    unitId: Types.ObjectId,
    questionAttempts: Array<{
      questionId: Types.ObjectId;
      score: number;
      isCorrect: boolean;
    }>,
  ) {
    const now = new Date();
    return this.model.findOneAndUpdate(
      {
        userId,
        courseId,
        'unitProgress.unitId': unitId,
      },
      {
        $push: {
          'unitProgress.$.questionAttempts': {
            $each: questionAttempts.map((qa) => ({
              ...qa,
              attemptedAt: now,
            })),
          },
        },
        $set: { lastActivityAt: now },
        $inc: { currentStreak: 1 },
      },
      { new: true },
    );
  }
}
