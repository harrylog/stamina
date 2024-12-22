import { BaseModel } from "./base.model";

export interface Course extends BaseModel {
  title: string;
  description: string;
  technology: string;
  sections?: string[]; // References to Section IDs
  isActive: boolean;
  difficulty?: number; // 0: Beginner, 1: Intermediate, 2: Advanced
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  technology?: string;
  difficulty?: number;
  isActive?: boolean;
  sections?: string[];
}

export interface UpdateCourseDto {
  title: string;
  description?: string;
  technology?: string;
  difficulty?: number;
  sections?: string[];
}
