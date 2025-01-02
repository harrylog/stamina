// section.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { SectionActions } from '../actions/section.actions';
import { SectionService } from '../../services/section.service';
import { Store } from '@ngrx/store';
import { selectCurrentCourseId } from '../selectors';
import { Router } from '@angular/router';
import { UnitActions } from '../actions';

@Injectable()
export class SectionEffects {
  // Loading sections effect
  loadSections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.loadSections),
      mergeMap(({ courseId }) =>
        this.sectionService.getSections(courseId).pipe(
          map((sections) => SectionActions.loadSectionsSuccess({ sections })),
          catchError((error) =>
            of(
              SectionActions.loadSectionsFailure({
                error: error.message || 'Failed to load sections',
              })
            )
          )
        )
      )
    )
  );

  // Creating a new section
  createSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.createSection),
      mergeMap(({ section }) =>
        this.sectionService.createSection(section).pipe(
          map((newSection) =>
            SectionActions.createSectionSuccess({ section: newSection })
          ),
          catchError((error) =>
            of(
              SectionActions.createSectionFailure({
                error: error.message || 'Failed to create section',
              })
            )
          )
        )
      )
    )
  );

  // Updating an existing section
  updateSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.updateSection),
      mergeMap(({ id, changes }) =>
        this.sectionService.updateSection(id, changes).pipe(
          map((updatedSection) =>
            SectionActions.updateSectionSuccess({ section: updatedSection })
          ),
          catchError((error) =>
            of(
              SectionActions.updateSectionFailure({
                error: error.message || 'Failed to update section',
              })
            )
          )
        )
      )
    )
  );

  // Deleting a section
  deleteSection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.deleteSection),
      mergeMap(({ id }) =>
        this.sectionService.deleteSection(id).pipe(
          map(() => SectionActions.deleteSectionSuccess({ id })),
          catchError((error) =>
            of(
              SectionActions.deleteSectionFailure({
                error: error.message || 'Failed to delete section',
              })
            )
          )
        )
      )
    )
  );
  setCurrentCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.setCurrentCourse),
      withLatestFrom(this.store.select(selectCurrentCourseId)),
      mergeMap(([{ courseId }, currentCourseId]) => {
        if (courseId && courseId !== currentCourseId) {
          return [SectionActions.loadSections({ courseId })];
        }
        return [];
      })
    )
  );

  navigateAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.createSectionSuccess),
      map(({ section }) =>
        SectionActions.navigateAfterCreate({ sectionId: section._id })
      )
    )
  );

  // Set up the state before navigation
  setNavigationState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.navigateAfterCreate),
      mergeMap(({ sectionId }) => [
        UnitActions.setCurrentSection({ sectionId }),
        SectionActions.setNavigationState({ sectionId }),
      ])
    )
  );

  // Perform the actual navigation
  completeNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectionActions.setNavigationState),
      mergeMap(({ sectionId }) => {
        this.router.navigate(['/learning/units']);
        return of(UnitActions.loadUnits({ sectionId }));
      })
    )
  );
  constructor(
    private actions$: Actions,
    private sectionService: SectionService,
    private router: Router,
    private store: Store
  ) {}
}
