import { EntityState } from '@ngrx/entity';
import { Course } from '../../models';

export interface CourseState extends EntityState<Course> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

// Without adapters
// export interface CourseState_noAdpt {
//   courses: { [id: string]: Course };
//   ids: string[];
//   selectedId: string | null;
//   loading: boolean;
//   error: string | null;
// }
