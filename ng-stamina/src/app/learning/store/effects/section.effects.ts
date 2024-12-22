// section.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SectionActions } from '../actions/section.actions';
import { SectionService } from '../../services/section.service';

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

  constructor(
    private actions$: Actions,
    private sectionService: SectionService
  ) {}
}
