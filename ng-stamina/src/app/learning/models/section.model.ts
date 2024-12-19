import { BaseEntity } from "./base.model";

export interface Section extends BaseEntity {
    title: string;
    description: string;
    orderIndex: number;
    courseId: string; // Reference to parent course
    unitIds: string[]; // Reference to units
    isUnlocked: boolean;
  }