import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from 'lib/common';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCourseHttp(@Body() createCourseDto: CreateCourseDto) {
    try {
      return await this.coursesService.create(createCourseDto);
    } catch (error) {
      console.error('Error creating course via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('create_course')
  async createCourseMessage(@Payload() createCourseDto: CreateCourseDto) {
    try {
      return await this.coursesService.create(createCourseDto);
    } catch (error) {
      console.error('Error creating course via message queue:', error);
      throw error;
    }
  }

  @Get()
  @MessagePattern('get_all_courses')
  async getAllCourses(@Query('technology') technology?: string) {
    return this.coursesService.findAll(technology);
  }

  @Get(':id')
  @MessagePattern('get_course_by_id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  @MessagePattern('update_course')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateOne(id, updateCourseDto);
  }

  @Delete(':id')
  @MessagePattern('delete_course')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteOne(id);
  }

  @Put(':id/sections')
  async addSections(
    @Param('id') id: string,
    @Body() data: { sectionIds: string[] },
  ) {
    return this.coursesService.addSections(id, data.sectionIds);
  }

  @Delete(':id/sections')
  async removeSections(
    @Param('id') id: string,
    @Body() data: { sectionIds: string[] },
  ) {
    return this.coursesService.removeSections(id, data.sectionIds);
  }
}
