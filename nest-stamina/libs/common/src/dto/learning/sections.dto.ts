// section.schema.ts
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
export class SectionDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }], default: [] })
  units?: Types.ObjectId[];

  @Prop({ default: 0 })
  orderIndex?: number;

  // timestamps: true will automatically add these
  createdAt?: Date;
}

export const SectionSchema = SchemaFactory.createForClass(SectionDocument);

// sections.dto.ts
export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  units?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  units?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
