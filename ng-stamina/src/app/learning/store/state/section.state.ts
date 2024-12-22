import { EntityState } from '@ngrx/entity';
import { Section } from '../../models';

export interface SectionState extends EntityState<Section> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
  // We might want to track the current courseId for filtering
  currentCourseId: string | null;
}
