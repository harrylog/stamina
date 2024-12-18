import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UnitsRepository } from './units.repository';
import { CreateUnitDto, UpdateUnitDto } from 'lib/common';

@Injectable()
export class UnitsService {
  constructor(private readonly unitsRepository: UnitsRepository) {}

  async create(createUnitDto: CreateUnitDto) {
    const unit = {
      ...createUnitDto,
      sectionId: new Types.ObjectId(createUnitDto.sectionId),
      questions:
        createUnitDto.questions?.map((id) => new Types.ObjectId(id)) || [],
      prerequisites:
        createUnitDto.prerequisites?.map((id) => new Types.ObjectId(id)) || [],
      orderIndex: createUnitDto.orderIndex ?? 0,
      xpValue: createUnitDto.xpValue ?? 50,
    };
    return await this.unitsRepository.create(unit);
  }

  async findAll(sectionId?: string) {
    const filterQuery = sectionId
      ? { sectionId: new Types.ObjectId(sectionId) }
      : {};
    const [units, total] = await Promise.all([
      this.unitsRepository.find(filterQuery),
      this.unitsRepository.count(filterQuery),
    ]);

    return {
      units,
      total,
    };
  }

  async findOne(id: string) {
    const unit = await this.unitsRepository.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async updateOne(id: string, updateUnitDto: UpdateUnitDto) {
    const updateData = { ...updateUnitDto };
    // if (updateUnitDto.prerequisites) {
    //   updateData.prerequisites = updateUnitDto.prerequisites.map(
    //     (id) => new Types.ObjectId(id),
    //   );
    // }

    return await this.unitsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateData,
    );
  }

  async deleteOne(id: string) {
    return await this.unitsRepository.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }

  async addQuestions(unitId: string, questionIds: string[]) {
    return await this.unitsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(unitId) },
      {
        $addToSet: {
          questions: { $each: questionIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }

  async removeQuestions(unitId: string, questionIds: string[]) {
    return await this.unitsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(unitId) },
      {
        $pull: {
          questions: { $in: questionIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }

  async addPrerequisites(unitId: string, prerequisiteIds: string[]) {
    return await this.unitsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(unitId) },
      {
        $addToSet: {
          prerequisites: {
            $each: prerequisiteIds.map((id) => new Types.ObjectId(id)),
          },
        },
      },
    );
  }

  async removePrerequisites(unitId: string, prerequisiteIds: string[]) {
    return await this.unitsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(unitId) },
      {
        $pull: {
          prerequisites: {
            $in: prerequisiteIds.map((id) => new Types.ObjectId(id)),
          },
        },
      },
    );
  }
}
