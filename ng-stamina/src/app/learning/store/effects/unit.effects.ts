// store/effects/unit.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UnitActions } from '../actions/unit.actions';
import { UnitService } from '../../services';

@Injectable()
export class UnitEffects {
  loadUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.loadUnits),
      mergeMap(({ sectionId }) =>
        this.unitService.getUnits(sectionId).pipe(
          map((units) => UnitActions.loadUnitsSuccess({ units })),
          catchError((error) =>
            of(UnitActions.loadUnitsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  reorderUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.reorderUnits),
      mergeMap(({ sectionId, unitIds }) =>
        this.unitService.reorderUnits(sectionId, unitIds).pipe(
          map((units) => UnitActions.reorderUnitsSuccess({ units })),
          catchError((error) =>
            of(UnitActions.reorderUnitsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Other effects (create, update, delete) here...

  constructor(private actions$: Actions, private unitService: UnitService) {}
}
