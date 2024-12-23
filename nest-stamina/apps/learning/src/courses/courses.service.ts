import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { Types } from 'mongoose';
import { CreateCourseDto, UpdateCourseDto } from 'lib/common';
import { SectionsService } from '../sections/sections.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly sectionsService: SectionsService, // Inject the sections service
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = {
      ...createCourseDto,
      title: createCourseDto.title,
      description: createCourseDto.description,
      technology: createCourseDto.technology, // Now required
      sections:
        createCourseDto.sections?.map((id) => new Types.ObjectId(id)) || [],
      isActive: createCourseDto.isActive ?? true,
      difficulty: createCourseDto.difficulty ?? 0,
    };
    return await this.coursesRepository.create(course);
  }

  async findAll(technology?: string) {
    const filterQuery = technology ? { technology } : {};
    const [courses, total] = await Promise.all([
      this.coursesRepository.find(filterQuery),
      this.coursesRepository.count(filterQuery),
    ]);
    return courses;
    return {
      courses,
      total,
    };
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async updateOne(id: string, updateCourseDto: UpdateCourseDto) {
    return await this.coursesRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateCourseDto,
    );
  }

  async deleteOne(id: string) {
    return await this.coursesRepository.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
  }

  async addSections(courseId: string, sectionIds: string[]) {
    return await this.coursesRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(courseId) },
      {
        $addToSet: {
          sections: { $each: sectionIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }

  async removeSections(courseId: string, sectionIds: string[]) {
    return await this.coursesRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(courseId) },
      {
        $pull: {
          sections: { $in: sectionIds.map((id) => new Types.ObjectId(id)) },
        },
      },
    );
  }
}
