// units.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from 'lib/common';

@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  // Standalone unit routes
  @Post('units')
  @HttpCode(HttpStatus.CREATED)
  async createUnit(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get('units')
  async getAllUnits(@Query('sectionId') sectionId?: string) {
    return this.unitsService.findAll(sectionId);
  }

  @Get('units/:id')
  async getUnit(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Put('units/:id')
  async updateUnit(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.updateOne(id, updateUnitDto);
  }

  @Delete('units/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUnit(@Param('id') id: string) {
    return this.unitsService.deleteOne(id);
  }

  // Nested routes under sections
  @Post('sections/:sectionId/units')
  async createSectionUnit(
    @Param('sectionId') sectionId: string,
    @Body() createUnitDto: CreateUnitDto,
  ) {
    console.log('Received request:', { sectionId, createUnitDto });

    if (createUnitDto.sectionId && createUnitDto.sectionId !== sectionId) {
      console.log('Section ID mismatch:', {
        urlSectionId: sectionId,
        dtoSectionId: createUnitDto.sectionId,
      });
      throw new BadRequestException('Section ID mismatch');
    }

    const unitData = { ...createUnitDto, sectionId };
    return this.unitsService.create(unitData);
  }

  @Get('sections/:sectionId/units')
  async getSectionUnits(@Param('sectionId') sectionId: string) {
    return this.unitsService.findAll(sectionId);
  }

  // Question management routes
  @Put('units/:id/questions')
  async addQuestions(
    @Param('id') id: string,
    @Body() data: { questionIds: string[] },
  ) {
    return this.unitsService.addQuestions(id, data.questionIds);
  }

  @Delete('units/:id/questions')
  async removeQuestions(
    @Param('id') id: string,
    @Body() data: { questionIds: string[] },
  ) {
    return this.unitsService.removeQuestions(id, data.questionIds);
  }

  // Prerequisites management routes
  @Put('units/:id/prerequisites')
  async addPrerequisites(
    @Param('id') id: string,
    @Body() data: { prerequisiteIds: string[] },
  ) {
    return this.unitsService.addPrerequisites(id, data.prerequisiteIds);
  }

  @Delete('units/:id/prerequisites')
  async removePrerequisites(
    @Param('id') id: string,
    @Body() data: { prerequisiteIds: string[] },
  ) {
    return this.unitsService.removePrerequisites(id, data.prerequisiteIds);
  }

  // Order management
  @Put('sections/:sectionId/units/reorder')
  async reorderUnits(
    @Param('sectionId') sectionId: string,
    @Body() data: { unitIds: string[] },
  ) {
    // Implement reordering logic in service
    return this.unitsService.reorderUnits(sectionId, data.unitIds);
  }
}
