// questions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { QuestionsRepository } from './questions.repository';
import { CreateQuestionDto, UpdateQuestionDto } from 'lib/common';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

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
