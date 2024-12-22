import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Course,
  CreateCourseDto,
  Section,
  UpdateCourseDto,
} from '../../models';

export const CourseActions = createActionGroup({
  source: 'Course',
  events: {
    // Load Courses
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ courses: Course[] }>(),
    'Load Courses Failure': props<{ error: string }>(),

    // Create Course
    'Create Course': props<{ course: CreateCourseDto }>(),
    'Create Course Success': props<{ course: Course }>(),
    'Create Course Failure': props<{ error: string }>(),

    // Update Course
    'Update Course': props<{ id: string; changes: UpdateCourseDto }>(),
    'Update Course Success': props<{ course: Course }>(),
    'Update Course Failure': props<{ error: string }>(),

    // Delete Course
    'Delete Course': props<{ id: string }>(),
    'Delete Course Success': props<{ id: string }>(),
    'Delete Course Failure': props<{ error: string }>(),

    // Select Course
    'Select Course': props<{ id: string | null }>(),
  },
});
