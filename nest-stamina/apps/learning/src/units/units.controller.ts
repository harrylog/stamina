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
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from 'lib/common';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUnitHttp(@Body() createUnitDto: CreateUnitDto) {
    try {
      return await this.unitsService.create(createUnitDto);
    } catch (error) {
      console.error('Error creating unit via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('create_unit')
  async createUnitMessage(@Payload() createUnitDto: CreateUnitDto) {
    try {
      return await this.unitsService.create(createUnitDto);
    } catch (error) {
      console.error('Error creating unit via message queue:', error);
      throw error;
    }
  }

  @Get()
  @MessagePattern('get_all_units')
  async getAllUnits(@Query('sectionId') sectionId?: string) {
    return this.unitsService.findAll(sectionId);
  }

  @Get(':id')
  @MessagePattern('get_unit_by_id')
  async getUnitById(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Put(':id')
  @MessagePattern('update_unit')
  async updateUnit(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitsService.updateOne(id, updateUnitDto);
  }

  @Delete(':id')
  @MessagePattern('delete_unit')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUnit(@Param('id') id: string) {
    return this.unitsService.deleteOne(id);
  }

  @Put(':id/questions')
  async addQuestions(
    @Param('id') id: string,
    @Body() data: { questionIds: string[] },
  ) {
    return this.unitsService.addQuestions(id, data.questionIds);
  }

  @Delete(':id/questions')
  async removeQuestions(
    @Param('id') id: string,
    @Body() data: { questionIds: string[] },
  ) {
    return this.unitsService.removeQuestions(id, data.questionIds);
  }

  @Put(':id/prerequisites')
  async addPrerequisites(
    @Param('id') id: string,
    @Body() data: { prerequisiteIds: string[] },
  ) {
    return this.unitsService.addPrerequisites(id, data.prerequisiteIds);
  }

  @Delete(':id/prerequisites')
  async removePrerequisites(
    @Param('id') id: string,
    @Body() data: { prerequisiteIds: string[] },
  ) {
    return this.unitsService.removePrerequisites(id, data.prerequisiteIds);
  }
}
