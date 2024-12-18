import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  CourseDocument,
  CourseSchema,
  DbModule,
  LoggerModule,
  QuestionDocument,
  QuestionSchema,
  SectionDocument,
  SectionSchema,
  UnitDocument,
  UnitSchema,
  UserProgressDocument,
  UserProgressSchema,
} from 'lib/common';
import { CoursesController } from './courses/courses.controller';
import { QuestionsController } from './questions/questions.controller';
import { ProgressController } from './progress/progress.controller';
import { CoursesService } from './courses/courses.service';
import { QuestionsService } from './questions/questions.service';
import { ProgressService } from './progress/progress.service';
import { UnitsController } from './units/units.controller';
import { UnitsService } from './units/units.service';
import { HealthController } from './health/health.controller';
import { SectionsController } from './sections/sections.controller';
import { SectionsService } from './sections/sections.service';
import { CoursesRepository } from './courses/courses.repository';
import { SectionsRepository } from './sections/sections.repository';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/learning/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        LEARNING_PORT: Joi.number().required(),
      }),
    }),
    DbModule,
    DbModule.forFeature([
      { name: CourseDocument.name, schema: CourseSchema },
      { name: SectionDocument.name, schema: SectionSchema },
      { name: UnitDocument.name, schema: UnitSchema },
      { name: QuestionDocument.name, schema: QuestionSchema },
      { name: UserProgressDocument.name, schema: UserProgressSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'users',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    CoursesController,
    QuestionsController,
    ProgressController,
    UnitsController,
    HealthController,
    SectionsController,
  ],
  providers: [
    CoursesService,
    CoursesRepository,

    QuestionsService,
    ProgressService,
    UnitsService,
    SectionsService,
    SectionsRepository,
  ],
})
export class LearningModule {}
