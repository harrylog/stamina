// store/selectors/unit.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { unitsAdapter } from '../adapters';
import { UnitState } from '../state/unit.state';

// Create the feature selector
export const selectUnitState = createFeatureSelector<UnitState>('units');

// Get the selectors from the adapter
const {
  selectIds: selectUnitIds,
  selectEntities: selectUnitEntities,
  selectAll: selectAllUnitsArray,
  selectTotal: selectTotalUnits,
} = unitsAdapter.getSelectors(selectUnitState);

// Select loading state
export const selectUnitsLoading = createSelector(
  selectUnitState,
  (state) => state.loading
);

// Select error state
export const selectUnitsError = createSelector(
  selectUnitState,
  (state) => state.error
);

// Select current section ID
export const selectCurrentSectionId = createSelector(
  selectUnitState,
  (state) => state.currentSectionId
);

// Select selected unit ID
export const selectSelectedUnitId = createSelector(
  selectUnitState,
  (state) => state.selectedId
);

// Select selected unit
export const selectSelectedUnit = createSelector(
  selectUnitEntities,
  selectSelectedUnitId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// Select all units for the current section
export const selectAllUnits = createSelector(
  selectAllUnitsArray,
  selectCurrentSectionId,
  (units, sectionId) => {
    if (!sectionId) return [];
    return units.filter((unit) => unit.sectionId === sectionId);
  }
);

// Select units ordered by their orderIndex
export const selectOrderedUnits = createSelector(selectAllUnits, (units) =>
  [...units].sort((a, b) => a.orderIndex - b.orderIndex)
);
