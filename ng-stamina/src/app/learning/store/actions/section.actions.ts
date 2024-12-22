// section.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Section, CreateSectionDto, UpdateSectionDto } from '../../models';

export const SectionActions = createActionGroup({
  source: 'Section',
  events: {
    // Load Sections (note the courseId parameter for filtering)
    'Load Sections': props<{ courseId?: string }>(),
    'Load Sections Success': props<{ sections: Section[] }>(),
    'Load Sections Failure': props<{ error: string }>(),

    // Create Section
    'Create Section': props<{ section: CreateSectionDto }>(),
    'Create Section Success': props<{ section: Section }>(),
    'Create Section Failure': props<{ error: string }>(),

    // Update Section
    'Update Section': props<{ id: string; changes: UpdateSectionDto }>(),
    'Update Section Success': props<{ section: Section }>(),
    'Update Section Failure': props<{ error: string }>(),

    // Delete Section
    'Delete Section': props<{ id: string }>(),
    'Delete Section Success': props<{ id: string }>(),
    'Delete Section Failure': props<{ error: string }>(),

    // Select Section
    'Select Section': props<{ id: string | null }>(),

    // Set Current Course (for filtering sections)
    'Set Current Course': props<{ courseId: string | null }>(),
  },
});
