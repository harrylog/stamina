import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, UserProgressDocument } from 'lib/common';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class UserProgressRepository extends AbstractRepository<UserProgressDocument> {
  protected readonly logger = new Logger(UserProgressRepository.name);

  constructor(
    @InjectModel(UserProgressDocument.name)
    userProgressModel: Model<UserProgressDocument>,
  ) {
    super(userProgressModel);
  }

  async find(filterQuery: FilterQuery<UserProgressDocument>) {
    return this.model.find(filterQuery).lean<UserProgressDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<UserProgressDocument>): Promise<number> {
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
