import { BaseModel } from './base.model';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  CODE_COMPLETION = 'code_completion',
}

export enum DifficultyLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2,
}

export interface Question extends BaseModel {
  title: string;
  content: string;
  type: QuestionType;
  correctAnswer: string;
  options: string[];
  units?: string[];
  difficulty: DifficultyLevel;
  pointsValue: number;
}

export interface CreateQuestionDto {
  title: string;
  content: string;
  type: QuestionType;
  correctAnswer: string;
  options: string[];
  units?: string[];
  difficulty?: DifficultyLevel;
  pointsValue?: number;
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
  type?: QuestionType;
  correctAnswer?: string;
  options?: string[];
  difficulty?: DifficultyLevel;
  pointsValue?: number;
}
