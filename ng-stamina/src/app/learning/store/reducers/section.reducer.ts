// section.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { SectionActions } from '../actions/section.actions';
import { sectionsAdapter } from '../adapters';
import { SectionState } from '../state/section.state';

// Initialize the state with the adapter
export const initialSectionState: SectionState = sectionsAdapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
  currentCourseId: null,
});

export const sectionReducer = createReducer(
  initialSectionState,

  // Loading actions
  on(SectionActions.loadSections, (state, { courseId }) => ({
    ...state,
    loading: true,
    error: null,
    currentCourseId: courseId || state.currentCourseId,
  })),

  on(SectionActions.loadSectionsSuccess, (state, { sections }) =>
    sectionsAdapter.setAll(sections, {
      ...state,
      loading: false,
    })
  ),

  on(SectionActions.loadSectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create actions
  on(SectionActions.createSection, (state) => ({
    ...state,
    loading: true,
  })),

  on(SectionActions.createSectionSuccess, (state, { section }) =>
    sectionsAdapter.addOne(section, {
      ...state,
      loading: false,
    })
  ),

  // Update actions
  on(SectionActions.updateSection, (state) => ({
    ...state,
    loading: true,
  })),

  on(SectionActions.updateSectionSuccess, (state, { section }) =>
    sectionsAdapter.updateOne(
      { id: section._id, changes: section },
      { ...state, loading: false }
    )
  ),

  // Delete actions
  on(SectionActions.deleteSection, (state) => ({
    ...state,
    loading: true,
  })),

  on(SectionActions.deleteSectionSuccess, (state, { id }) =>
    sectionsAdapter.removeOne(id, state)
  ),

  // Selection action
  on(SectionActions.selectSection, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),

  // Set current course
  on(SectionActions.setCurrentCourse, (state, { courseId }) => ({
    ...state,
    currentCourseId: courseId,
  }))
);
