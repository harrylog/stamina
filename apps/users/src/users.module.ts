import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbModule, LoggerModule, UserDocument, UserSchema } from 'lib/common';
import { UsersRepository } from './users.repository';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
    DbModule,
    DbModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/users/.env',

      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        USERS_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
