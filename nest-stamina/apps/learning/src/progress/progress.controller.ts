import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressService } from './progress.service';
import { CreateProgressDto, UpdateUnitProgressDto } from 'lib/common';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async initializeProgressHttp(@Body() createDto: CreateProgressDto) {
    try {
      return await this.progressService.initializeProgress(createDto);
    } catch (error) {
      console.error('Error initializing progress via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('initialize_progress')
  async initializeProgressMessage(@Payload() createDto: CreateProgressDto) {
    try {
      return await this.progressService.initializeProgress(createDto);
    } catch (error) {
      console.error('Error initializing progress via message queue:', error);
      throw error;
    }
  }

  @Put(':userId/courses/:courseId/units')
  async updateUnitProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() updateDto: UpdateUnitProgressDto,
  ) {
    return await this.progressService.updateUnitProgress(
      userId,
      courseId,
      updateDto,
    );
  }

  @Get(':userId/courses/:courseId')
  async getUserCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.progressService.getUserCourseProgress(userId, courseId);
  }

  @Get(':userId/courses/:courseId/units/:unitId/completion')
  async getUnitCompletion(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Param('unitId') unitId: string,
  ) {
    return await this.progressService.getUnitCompletion(
      userId,
      courseId,
      unitId,
    );
  }

  @Get(':userId/courses/:courseId/units/:unitId/unlock')
  async checkUnitUnlock(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Param('unitId') unitId: string,
    @Body('prerequisiteUnitId') prerequisiteUnitId: string,
  ) {
    return await this.progressService.checkUnitUnlock(
      userId,
      courseId,
      unitId,
      prerequisiteUnitId,
    );
  }

  @Get(':userId')
  async getProgress(@Param('userId') userId: string) {
    return await this.progressService.getProgress(userId);
  }

  @Get(':userId/streak')
  async getCurrentStreak(@Param('userId') userId: string) {
    return await this.progressService.getCurrentStreak(userId);
  }
}
