import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SectionsRepository } from './sections.repository';
import { CreateSectionDto, UpdateSectionDto } from 'lib/common';

@Injectable()
export class SectionsService {
  constructor(private readonly sectionsRepository: SectionsRepository) {}

  async create(createSectionDto: CreateSectionDto) {
    const section = {
      ...createSectionDto,
      courseId: new Types.ObjectId(createSectionDto.courseId),
      units: createSectionDto.units?.map((id) => new Types.ObjectId(id)) || [],
      orderIndex: createSectionDto.orderIndex ?? 0,
    };
    return await this.sectionsRepository.create(section);
  }

  async findAll(courseId?: string) {
    const filterQuery = courseId
      ? { courseId: new Types.ObjectId(courseId) }
      : {};
    const [sections, total] = await Promise.all([
      this.sectionsRepository.find(filterQuery),
      this.sectionsRepository.count(filterQuery),
    ]);

    return {
      sections,
      total,
    };
  }

  async findOne(id: string) {
    const section = await this.sectionsRepository.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async updateOne(id: string, updateSectionDto: UpdateSectionDto) {
    return await this.sectionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateSectionDto,
    );
  }

  async deleteOne(id: string) {
    return await this.sectionsRepository.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }

  async addUnits(sectionId: string, unitIds: string[]) {
    return await this.sectionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(sectionId) },
      {
        $addToSet: {
          units: { $each: unitIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }

  async removeUnits(sectionId: string, unitIds: string[]) {
    return await this.sectionsRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(sectionId) },
      {
        $pull: {
          units: { $in: unitIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }
}
