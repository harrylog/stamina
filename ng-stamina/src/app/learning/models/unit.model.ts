import { BaseModel } from "./base.model";

export interface Unit extends BaseModel {
  title: string;
  description: string;
  sectionId: string;
  questions?: string[];
  prerequisites?: string[];
  orderIndex: number;
  xpValue: number;
  createdBy: string;
}

export interface CreateUnitDto {
  title: string;
  description: string;
  sectionId: string;
  questions?: string[];
  prerequisites?: string[];
  orderIndex?: number;
  xpValue?: number;
  
}

export interface UpdateUnitDto {
  title?: string;
  description?: string;
  orderIndex?: number;
  xpValue?: number;
  prerequisites?: string[];
}
