// store/actions/unit.actions.ts
import { createActionGroup, props } from '@ngrx/store';
import { Unit, CreateUnitDto, UpdateUnitDto } from '../../models';

export const UnitActions = createActionGroup({
  source: 'Unit',
  events: {
    // Load Units (note the sectionId parameter for filtering)
    'Load Units': props<{ sectionId?: string }>(),
    'Load Units Success': props<{ units: Unit[] }>(),
    'Load Units Failure': props<{ error: string }>(),

    // Create Unit
    'Create Unit': props<{ sectionId: string; unit: CreateUnitDto }>(),
    'Create Unit Success': props<{ unit: Unit }>(),
    'Create Unit Failure': props<{ error: string }>(),

    // Update Unit
    'Update Unit': props<{ id: string; changes: UpdateUnitDto }>(),
    'Update Unit Success': props<{ unit: Unit }>(),
    'Update Unit Failure': props<{ error: string }>(),

    // Delete Unit
    'Delete Unit': props<{ id: string }>(),
    'Delete Unit Success': props<{ id: string }>(),
    'Delete Unit Failure': props<{ error: string }>(),

    // Select Unit
    'Select Unit': props<{ id: string | null }>(),

    // Set Current Section (for filtering units)
    'Set Current Section': props<{ sectionId: string | null }>(),

    // Reorder Units
    'Reorder Units': props<{ sectionId: string; unitIds: string[] }>(),
    'Reorder Units Success': props<{ units: Unit[] }>(),
    'Reorder Units Failure': props<{ error: string }>(),

    // Question Management
    'Add Questions': props<{ unitId: string; questionIds: string[] }>(),
    'Add Questions Success': props<{ unit: Unit }>(),
    'Add Questions Failure': props<{ error: string }>(),

    'Remove Questions': props<{ unitId: string; questionIds: string[] }>(),
    'Remove Questions Success': props<{ unit: Unit }>(),
    'Remove Questions Failure': props<{ error: string }>(),

    // Prerequisites Management
    'Add Prerequisites': props<{ unitId: string; prerequisiteIds: string[] }>(),
    'Add Prerequisites Success': props<{ unit: Unit }>(),
    'Add Prerequisites Failure': props<{ error: string }>(),

    'Remove Prerequisites': props<{
      unitId: string;
      prerequisiteIds: string[];
    }>(),
    'Remove Prerequisites Success': props<{ unit: Unit }>(),
    'Remove Prerequisites Failure': props<{ error: string }>(),
  },
});
