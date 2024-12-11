import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  DbModule,
  JwtAuthGuardCommon,
  LoggerModule,
  UserDocument,
  UserSchema,
} from 'lib/common';
import { UsersRepository } from './users.repository';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from 'lib/common/auth/roles.guard';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    RolesGuard,
    // JwtAuthGuardCommon,
    // {
    //   provide: 'APP_GUARD',
    //   useClass: RolesGuard,
    // },
  ],
})
export class UsersModule {}
