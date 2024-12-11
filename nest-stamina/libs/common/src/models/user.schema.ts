// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { AbstractDocument } from '../db';
// import { UserRole } from '../enums';

// @Schema({ versionKey: false, timestamps: true })
// export class UserDocument extends AbstractDocument {
//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
//   roles?: UserRole[];

//   @Prop({ default: true })
//   isActive?: boolean;

//   @Prop()
//   name?: string;

//   @Prop()
//   lastLogin?: Date;

//   // timestamps: true will automatically add these
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(UserDocument);
