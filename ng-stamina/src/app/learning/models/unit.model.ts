import { BaseEntity } from "./base.model";

export interface Unit extends BaseEntity {
    title: string;
    description: string;
    orderIndex: number;
    sectionId: string; // Reference to parent section
    questionIds: string[]; // Reference to questions
    type: 'lesson' | 'quiz' | 'practice';
    estimatedDuration: number; // in minutes
  }