// sections.controller.ts
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
import { SectionsService } from './sections.service';
import { CreateSectionDto, UpdateSectionDto } from 'lib/common';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSectionHttp(@Body() createSectionDto: CreateSectionDto) {
    try {
      return await this.sectionsService.create(createSectionDto);
    } catch (error) {
      console.error('Error creating section via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('create_section')
  async createSectionMessage(@Payload() createSectionDto: CreateSectionDto) {
    try {
      return await this.sectionsService.create(createSectionDto);
    } catch (error) {
      console.error('Error creating section via message queue:', error);
      throw error;
    }
  }

  @Get()
  @MessagePattern('get_all_sections')
  async getAllSections(@Query('courseId') courseId?: string) {
    return this.sectionsService.findAll(courseId);
  }

  @Get(':id')
  @MessagePattern('get_section_by_id')
  async getSectionById(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Put(':id')
  @MessagePattern('update_section')
  async updateSection(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.updateOne(id, updateSectionDto);
  }

  @Delete(':id')
  @MessagePattern('delete_section')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSection(@Param('id') id: string) {
    return this.sectionsService.deleteOne(id);
  }

  @Put(':id/units')
  async addUnits(@Param('id') id: string, @Body() data: { unitIds: string[] }) {
    return this.sectionsService.addUnits(id, data.unitIds);
  }

  @Delete(':id/units')
  async removeUnits(
    @Param('id') id: string,
    @Body() data: { unitIds: string[] },
  ) {
    return this.sectionsService.removeUnits(id, data.unitIds);
  }
}
