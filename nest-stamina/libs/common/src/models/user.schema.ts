import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../db';
import { UserRole } from '../enums';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
