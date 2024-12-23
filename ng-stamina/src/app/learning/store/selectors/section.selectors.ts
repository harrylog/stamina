// section.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { sectionsAdapter } from '../adapters';
import { SectionState } from '../state/section.state';

// Create the feature selector
export const selectSectionState =
  createFeatureSelector<SectionState>('sections');

// Get the selectors from the adapter
const {
  selectIds: selectSectionIds,
  selectEntities: selectSectionEntities,
  selectAll: selectAllSectionsArray,
  selectTotal: selectTotalSections,
} = sectionsAdapter.getSelectors(selectSectionState);

// Select loading state
export const selectSectionsLoading = createSelector(
  selectSectionState,
  (state) => state.loading
);

// Select error state
export const selectSectionsError = createSelector(
  selectSectionState,
  (state) => state.error
);

// Select current course ID
export const selectCurrentCourseId = createSelector(
  selectSectionState,
  (state) => state.currentCourseId
);

// Select selected section ID
export const selectSelectedSectionId = createSelector(
  selectSectionState,
  (state) => state.selectedId
);

// Select selected section
export const selectSelectedSection = createSelector(
  selectSectionEntities,
  selectSelectedSectionId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// Select all sections for the current course
export const selectAllSections = createSelector(
  selectAllSectionsArray,
  selectCurrentCourseId,
  (sections, courseId) => {
    if (!courseId) return [];
    return sections.filter((section) => section.courseId === courseId);
  }
);

// Select sections ordered by their orderIndex
export const selectOrderedSections = createSelector(
  selectAllSections,
  (sections) => [...sections].sort((a, b) => a.orderIndex - b.orderIndex)
);
