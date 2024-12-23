import { createReducer, on } from '@ngrx/store';
import { UnitActions } from '../actions/unit.actions';
import { unitsAdapter } from '../adapters';
import { UnitState } from '../state/unit.state';

export const initialUnitState: UnitState = unitsAdapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
  currentSectionId: null,
});

export const unitReducer = createReducer(
  initialUnitState,

  // Loading actions
  on(UnitActions.loadUnits, (state, { sectionId }) => ({
    ...state,
    loading: true,
    error: null,
    currentSectionId: sectionId || state.currentSectionId,
  })),

  on(UnitActions.loadUnitsSuccess, (state, { units }) =>
    unitsAdapter.setAll(units, { ...state, loading: false })
  ),

  on(UnitActions.loadUnitsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create actions
  on(UnitActions.createUnit, (state) => ({
    ...state,
    loading: true,
  })),

  on(UnitActions.createUnitSuccess, (state, { unit }) =>
    unitsAdapter.addOne(unit, { ...state, loading: false })
  ),

  on(UnitActions.createUnitFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update actions
  on(UnitActions.updateUnit, (state) => ({
    ...state,
    loading: true,
  })),

  on(UnitActions.updateUnitSuccess, (state, { unit }) =>
    unitsAdapter.updateOne(
      { id: unit._id, changes: unit },
      { ...state, loading: false }
    )
  ),

  on(UnitActions.updateUnitFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete actions
  on(UnitActions.deleteUnit, (state) => ({
    ...state,
    loading: true,
  })),

  on(UnitActions.deleteUnitSuccess, (state, { id }) =>
    unitsAdapter.removeOne(id, { ...state, loading: false })
  ),

  on(UnitActions.deleteUnitFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Selection action
  on(UnitActions.selectUnit, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),

  // Set current section
  on(UnitActions.setCurrentSection, (state, { sectionId }) => ({
    ...state,
    currentSectionId: sectionId,
  })),

  // Reorder actions
  on(UnitActions.reorderUnitsSuccess, (state, { units }) =>
    unitsAdapter.setAll(units, { ...state, loading: false })
  )
);
