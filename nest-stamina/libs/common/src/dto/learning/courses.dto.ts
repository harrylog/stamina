// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../db';
import { Types } from 'mongoose';
import {
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }], default: [] })
  sections?: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  difficulty?: number; // 0: Beginner, 1: Intermediate, 2: Advanced
  // timestamps: true will automatically add these
  createdAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocument);

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  sections?: string[];
}

export class UpdateCourseDto {
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
