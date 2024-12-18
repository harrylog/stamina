// user-progress.schema.ts updates
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../db';

import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';

@Schema({ _id: false })
class UnitProgress {
  @Prop({ type: Types.ObjectId, required: true })
  unitId: Types.ObjectId;

  @Prop({
    type: [
      {
        questionId: { type: Types.ObjectId },
        score: Number,
        isCorrect: Boolean,
        attemptedAt: Date,
      },
    ],
    default: [],
  })
  questionAttempts: Array<{
    questionId: Types.ObjectId;
    score: number;
    isCorrect: boolean;
    attemptedAt: Date;
  }>;

  @Prop({ default: false })
  isUnlocked: boolean;

  @Prop({ default: false })
  completed: boolean;
}

interface UserProgressMethods {
  isUnitCompleted(unitId: string): boolean;
  canUnlockUnit(unitId: string, prerequisiteUnitId: string): boolean;
}

@Schema({ versionKey: false, timestamps: true })
export class UserProgressDocument
  extends AbstractDocument
  implements UserProgressMethods
{
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [UnitProgress], default: [] })
  unitProgress: UnitProgress[];

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ type: Date })
  lastActivityAt: Date;

  // Declare the methods in the class
  isUnitCompleted: (unitId: string) => boolean;
  canUnlockUnit: (unitId: string, prerequisiteUnitId: string) => boolean;
}

const UserProgressSchema = SchemaFactory.createForClass(UserProgressDocument);

// Add virtual for unit completion percentage
UserProgressSchema.virtual('unitCompletionPercentages').get(function () {
  return this.unitProgress.map((up) => {
    const total = up.questionAttempts.length;
    if (total === 0) return 0;

    const correct = up.questionAttempts.filter((qa) => qa.isCorrect).length;
    return (correct / total) * 100;
  });
});

// Add method to check if unit is completed (>= 70% correct)
UserProgressSchema.methods.isUnitCompleted = function (unitId: string) {
  const unitProgress = this.unitProgress.find(
    (up) => up.unitId.toString() === unitId,
  );
  if (!unitProgress) return false;

  const total = unitProgress.questionAttempts.length;
  if (total === 0) return false;

  const correct = unitProgress.questionAttempts.filter(
    (qa) => qa.isCorrect,
  ).length;
  return correct / total >= 0.7; // 70% threshold
};

// Add method to check if unit can be unlocked
UserProgressSchema.methods.canUnlockUnit = function (
  unitId: string,
  prerequisiteUnitId: string,
) {
  if (!prerequisiteUnitId) return true;
  return this.isUnitCompleted(prerequisiteUnitId);
};

// Pre-save middleware to update unit completion status
UserProgressSchema.pre('save', function (next) {
  this.unitProgress.forEach((up) => {
    const total = up.questionAttempts.length;
    if (total > 0) {
      const correct = up.questionAttempts.filter((qa) => qa.isCorrect).length;
      up.completed = correct / total >= 0.7;
    }
  });
  next();
});

export { UserProgressSchema };

export class QuestionAttemptDto {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsNumber()
  score: number;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateUserProgressDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}

export class UpdateUnitProgressDto {
  @IsMongoId()
  @IsNotEmpty()
  unitId: string;

  @IsArray()
  questionAttempts: QuestionAttemptDto[];
}
