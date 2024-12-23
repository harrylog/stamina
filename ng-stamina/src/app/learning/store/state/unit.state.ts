import { EntityState } from '@ngrx/entity';
import { Unit } from '../../models';

export interface UnitState extends EntityState<Unit> {
  selectedId: string | null;
  loading: boolean;
  error: string | null;
  currentSectionId: string | null;
}
