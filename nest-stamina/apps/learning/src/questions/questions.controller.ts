// questions.controller.ts
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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from 'lib/common';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestionHttp(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.questionsService.create(createQuestionDto);
    } catch (error) {
      console.error('Error creating question via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('create_question')
  async createQuestionMessage(@Payload() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.questionsService.create(createQuestionDto);
    } catch (error) {
      console.error('Error creating question via message queue:', error);
      throw error;
    }
  }

  @Get()
  @MessagePattern('get_all_questions')
  async getAllQuestions(
    @Query('unitId') unitId?: string,
    @Query('difficulty') difficulty?: number,
  ) {
    return this.questionsService.findAll(unitId, difficulty);
  }

  @Get(':id')
  @MessagePattern('get_question_by_id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Put(':id')
  @MessagePattern('update_question')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.updateOne(id, updateQuestionDto);
  }

  @Delete(':id')
  @MessagePattern('delete_question')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id') id: string) {
    return this.questionsService.deleteOne(id);
  }

  @Put(':id/units')
  async addToUnits(
    @Param('id') id: string,
    @Body() data: { unitIds: string[] },
  ) {
    return this.questionsService.addToUnits(id, data.unitIds);
  }

  @Delete(':id/units')
  async removeFromUnits(
    @Param('id') id: string,
    @Body() data: { unitIds: string[] },
  ) {
    return this.questionsService.removeFromUnits(id, data.unitIds);
  }
}
