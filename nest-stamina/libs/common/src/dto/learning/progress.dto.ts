// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../db';
import { Types } from 'mongoose';
import { IsBoolean, IsMongoId, IsNumber } from 'class-validator';

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

export class UpdateUserProgressDto {
  @IsMongoId()
  unitId: string;

  @IsNumber()
  score: number;

  @IsBoolean()
  completed: boolean;
}
