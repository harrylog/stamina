import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../db';
import { Types } from 'mongoose';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@Schema({ versionKey: false, timestamps: true })
export class UnitDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Section', required: true })
  sectionId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }], default: [] })
  questions?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Unit' }], default: [] })
  prerequisites?: Types.ObjectId[];

  @Prop({ default: 0 })
  orderIndex?: number;

  @Prop({ default: 50 })
  xpValue?: number;

  // timestamps: true will automatically add these
  createdAt?: Date;
  // @Prop({ default: '' })
  // createdBy: string;
}

export const UnitSchema = SchemaFactory.createForClass(UnitDocument);

// units.dto.ts
export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  sectionId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  questions?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  xpValue?: number;
}

export class UpdateUnitDto {
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

  @IsNumber()
  @IsOptional()
  xpValue?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  prerequisites?: string[];
}
