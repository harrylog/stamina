import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../db';
import { Types } from 'mongoose';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  CODE_COMPLETION = 'code_completion',
}

export enum DifficultyLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2,
}

@Schema({ versionKey: false, timestamps: true })
export class QuestionDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }], default: [] })
  units?: Types.ObjectId[];

  @Prop({
    type: Number,
    enum: DifficultyLevel,
    default: DifficultyLevel.BEGINNER,
  })
  difficulty: DifficultyLevel;

  @Prop({ default: 10 })
  pointsValue: number;

  // timestamps: true will automatically add these
  createdAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionDocument);

// questions.dto.ts
export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  options: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  units?: string[];

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsNumber()
  @IsOptional()
  pointsValue?: number;
}

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  correctAnswer?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  options?: string[];

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficulty?: DifficultyLevel;

  @IsNumber()
  @IsOptional()
  pointsValue?: number;
}
