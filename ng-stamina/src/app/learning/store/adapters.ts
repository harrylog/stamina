import { createEntityAdapter } from '@ngrx/entity';
import { Course, Section, Unit, Question } from '../models';

export const coursesAdapter = createEntityAdapter<Course>({
  selectId: (course) => course._id,
});

// export const sectionsAdapter = createEntityAdapter<Section>({
//   selectId: (section) => section._id,
//   sortComparer: (a, b) => a.orderIndex - b.orderIndex,
// });

// export const unitsAdapter = createEntityAdapter<Unit>({
//   selectId: (unit) => unit._id,
//   sortComparer: (a, b) => a.orderIndex - b.orderIndex,
// });

// export const questionsAdapter = createEntityAdapter<Question>({
//   selectId: (question) => question._id,
// });
