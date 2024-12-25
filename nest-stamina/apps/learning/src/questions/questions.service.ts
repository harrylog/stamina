// questions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection, Model, Types } from 'mongoose';
import { QuestionsRepository } from './questions.repository';
import {
  CreateQuestionDto,
  DifficultyLevel,
  QuestionDocument,
  UpdateQuestionDto,
} from 'lib/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UnitsService } from '../units/units.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(QuestionDocument.name)
    private questionModel: Model<QuestionDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly unitsService: UnitsService,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async createWithUnits(createQuestionDto: CreateQuestionDto) {
    // Start a MongoDB session for the transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // First, create the question
      const question = new this.questionModel({
        ...createQuestionDto,
        units:
          createQuestionDto.units?.map((id) => new Types.ObjectId(id)) || [],
        difficulty: createQuestionDto.difficulty ?? DifficultyLevel.BEGINNER,
        pointsValue: createQuestionDto.pointsValue ?? 10,
      });

      // Save the question within the transaction
      const savedQuestion = await question.save({ session });

      // If units were specified, update each unit to include this question
      if (createQuestionDto.units && createQuestionDto.units.length > 0) {
        await this.questionModel.updateMany(
          { _id: { $in: createQuestionDto.units } },
          { $addToSet: { questions: savedQuestion._id } },
          { session },
        );

        // Log the units being updated
        console.log('Updating units with new question:', {
          questionId: savedQuestion._id,
          unitIds: createQuestionDto.units,
        });
      }

      // Commit the transaction
      await session.commitTransaction();

      // Return the populated question document
      return await this.questionModel
        .findById(savedQuestion._id)
        .populate('units')
        .exec();
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  }
  async create(createQuestionDto: CreateQuestionDto) {
    const question = {
      ...createQuestionDto,
      units: createQuestionDto.units?.map((id) => new Types.ObjectId(id)) || [],
      difficulty: createQuestionDto.difficulty ?? 0,
      pointsValue: createQuestionDto.pointsValue ?? 10,
    };
    return await this.questionsRepository.create(question);
  }

  async findAll(unitId?: string, difficulty?: number) {
    const filterQuery: any = {};
    if (unitId) {
      filterQuery.units = new Types.ObjectId(unitId);
    }
    if (typeof difficulty !== 'undefined') {
      filterQuery.difficulty = difficulty;
    }

    const [questions, total] = await Promise.all([
      this.questionsRepository.find(filterQuery),
      this.questionsRepository.count(filterQuery),
    ]);

    return questions;
    return {
      questions,
      total,
    };
  }

  async findOne(id: string) {
    const question = await this.questionsRepository.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async updateOne(id: string, updateQuestionDto: UpdateQuestionDto) {
    return await this.questionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateQuestionDto,
    );
  }

  async deleteOne(id: string) {
    return await this.questionsRepository.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }

  async addToUnits(questionId: string, unitIds: string[]) {
    return await this.questionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(questionId) },
      {
        $addToSet: {
          units: { $each: unitIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }

  async removeFromUnits(questionId: string, unitIds: string[]) {
    return await this.questionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(questionId) },
      {
        $pull: {
          units: { $in: unitIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }
}
