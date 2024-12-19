import { BaseEntity } from "./base.model";

export interface Course extends BaseEntity {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  isPublished: boolean;
  sectionIds: string[]; // Reference to sections
  authorId: string;
}
