
import { BaseEntity } from "./base.model";

export interface Question extends BaseEntity {
    prompt: string;
    type: 'multiple-choice' | 'coding' | 'fill-blank';
    difficulty: number; // 1-5 scale
    points: number;
    unitIds: string[]; // References to parent units (many-to-many)
    options?: QuestionOption[];
    correctAnswer: string;
    explanation?: string;
  }

  export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  