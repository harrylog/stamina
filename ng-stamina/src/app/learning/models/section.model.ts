import { BaseModel } from "./base.model";

export interface Section extends BaseModel {
  title: string;
  description: string;
  courseId: string;
  units?: string[];
  orderIndex: number;
}

export interface CreateSectionDto {
  title: string;
  description: string;
  courseId: string;
  orderIndex?: number;
  units?: string[];
}

export interface UpdateSectionDto {
  title?: string;
  description?: string;
  orderIndex?: number;
  units?: string[];
}