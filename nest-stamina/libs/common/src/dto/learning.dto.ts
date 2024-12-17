// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../db';
import { Types } from 'mongoose';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@Schema({ versionKey: false, timestamps: true })
export class CourseDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  technology: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }] })
  sections: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  difficulty: number; // 0: Beginner, 1: Intermediate, 2: Advanced
  // timestamps: true will automatically add these
  createdAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);

@Schema({ timestamps: true })
export class SectionDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }] })
  units: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ default: 0 })
  orderIndex: number;
}

export const SectionSchema = SchemaFactory.createForClass(SectionDocument);

@Schema({ timestamps: true })
export class UnitDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }] })
  units: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ default: 0 })
  orderIndex: number;
}

export const UnitSchema = SchemaFactory.createForClass(UnitDocument);

@Schema({ timestamps: true })
export class QuestionDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }] })
  units: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ default: 0 })
  orderIndex: number;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionDocument);

@Schema({ timestamps: true })
export class UserProgressDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }] })
  units: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ default: 0 })
  orderIndex: number;
}

export const UserProgressSchema =
  SchemaFactory.createForClass(UserProgressDocument);

///
// src/dtos/course.dto.ts
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  technology: string;

  @IsNumber()
  @IsOptional()
  difficulty?: number;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  difficulty?: number;

  @IsArray()
  @IsMongoId({ each: true })
  units: string[];

  @IsNumber()
  @IsOptional()
  points?: number;
}

export class UpdateUserProgressDto {
  @IsMongoId()
  unitId: string;

  @IsNumber()
  score: number;

  @IsBoolean()
  completed: boolean;
}
