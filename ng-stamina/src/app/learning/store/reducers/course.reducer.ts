import { createReducer, on } from '@ngrx/store';
import { CourseActions } from '../actions/course.actions';
import { coursesAdapter } from '../adapters';
import { CourseState } from '../state/course.state';

export const initialState: CourseState =
  coursesAdapter.getInitialState({
    selectedId: null,
    loading: false,
    error: null,
  });

export const courseReducer = createReducer(
  initialState,

  // Load
  on(CourseActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CourseActions.loadCoursesSuccess, (state, { courses }) =>
    coursesAdapter.setAll(courses, {
      ...state,
      loading: false,
    })
  ),

  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(CourseActions.createCourse, (state) => ({
    ...state,
    loading: true,
  })),

  on(CourseActions.createCourseSuccess, (state, { course }) =>
    coursesAdapter.addOne(course, {
      ...state,
      loading: false,
    })
  ),

  // Without adapters
  // on(CourseActions.createCourseSuccess, (state, { course }) => ({
  //     ...state,
  //     courses: {
  //       ...state.courses,
  //       [course._id]: course,
  //     },
  //     ids: [...state.ids, course._id],
  //   }));

  // Update
  on(CourseActions.updateCourse, (state) => ({
    ...state,
    loading: true,
  })),

  on(CourseActions.updateCourseSuccess, (state, { course }) =>
    coursesAdapter.updateOne(
      { id: course._id, changes: course },
      { ...state, loading: false }
    )
  ),

  // Delete
  on(CourseActions.deleteCourseSuccess, (state, { id }) =>
    coursesAdapter.removeOne(id, state)
  ),

  // Select
  on(CourseActions.selectCourse, (state, { id }) => ({
    ...state,
    selectedId: id,
  }))
);
