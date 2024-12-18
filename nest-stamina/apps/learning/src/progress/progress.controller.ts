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
import { UserProgressService } from './progress.service';
import { CreateUserProgressDto, UpdateUnitProgressDto } from 'lib/common';

@Controller('progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async initializeProgressHttp(@Body() createDto: CreateUserProgressDto) {
    try {
      return await this.userProgressService.initializeProgress(createDto);
    } catch (error) {
      console.error('Error initializing progress via HTTP:', error);
      throw error;
    }
  }

  @MessagePattern('initialize_progress')
  async initializeProgressMessage(@Payload() createDto: CreateUserProgressDto) {
    try {
      return await this.userProgressService.initializeProgress(createDto);
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
    return await this.userProgressService.updateUnitProgress(
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
    return await this.userProgressService.getUserCourseProgress(
      userId,
      courseId,
    );
  }

  @Get(':userId/courses/:courseId/units/:unitId/completion')
  async getUnitCompletion(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Param('unitId') unitId: string,
  ) {
    return await this.userProgressService.getUnitCompletion(
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
    return await this.userProgressService.checkUnitUnlock(
      userId,
      courseId,
      unitId,
      prerequisiteUnitId,
    );
  }

  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    return await this.userProgressService.getUserProgress(userId);
  }

  @Get(':userId/streak')
  async getCurrentStreak(@Param('userId') userId: string) {
    return await this.userProgressService.getCurrentStreak(userId);
  }
}
