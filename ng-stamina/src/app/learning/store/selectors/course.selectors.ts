import { createFeatureSelector, createSelector } from '@ngrx/store';
import { coursesAdapter } from '../adapters';
import { CourseState } from '../state/course.state';

export const selectCourseState = createFeatureSelector<CourseState>('courses');
export const {
  selectIds: selectCourseIds,
  selectEntities: selectCourseEntities,
  selectAll: selectAllCourses,
  selectTotal: selectTotalCourses,
} = coursesAdapter.getSelectors(selectCourseState);

export const selectCourseLoading = createSelector(
  selectCourseState,
  (state) => state.loading
);

export const selectCourseError = createSelector(
  selectCourseState,
  (state) => state.error
);

export const selectSelectedCourseId = createSelector(
  selectCourseState,
  (state) => state.selectedId
);

export const selectSelectedCourse = createSelector(
  selectCourseEntities,
  selectSelectedCourseId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);
