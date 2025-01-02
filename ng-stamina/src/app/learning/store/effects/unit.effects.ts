// store/effects/unit.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UnitActions } from '../actions/unit.actions';
import { UnitService } from '../../services';
import { Store } from '@ngrx/store';
import { Unit } from '../../models';
import { Router } from '@angular/router';
import { QuestionActions } from '../actions';

@Injectable()
export class UnitEffects {
  private readonly store = inject(Store);

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
  createUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitActions.createUnit),
      switchMap(({ sectionId, unit }) => {
        // Validate MongoDB ObjectId format
        if (!sectionId || !sectionId.match(/^[0-9a-fA-F]{24}$/)) {
          return of(
            UnitActions.createUnitFailure({
              error: 'Invalid section ID format',
            })
          );
        }

        return this.unitService.createUnit(sectionId, unit).pipe(
          map((createdUnit: Unit) =>
            UnitActions.createUnitSuccess({ unit: createdUnit })
          ),
          catchError((error) => of(UnitActions.createUnitFailure({ error })))
        );
      })
    );
  });

  navigateAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.createUnitSuccess),
      map(({ unit }) => UnitActions.navigateAfterCreate({ unitId: unit._id }))
    )
  );

  setNavigationState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.navigateAfterCreate),
      mergeMap(({ unitId }) => [
        // QuestionActions.setCurrentUnit({ unitId }),
        UnitActions.setNavigationState({ unitId }),
      ])
    )
  );

  completeNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.setNavigationState),
      mergeMap(({ unitId }) => {
        this.router.navigate(['/learning/questions']);
        return of(QuestionActions.loadQuestions({ unitIds: [unitId] }));
      })
    )
  );
  constructor(
    private actions$: Actions,
    private unitService: UnitService,
    private router: Router,
  ) {}
}
