// course.effects.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CourseActions } from '../actions/course.actions';
import { SectionActions } from '../actions/section.actions';
import { CourseService } from '../../services';

@Injectable()
export class CourseEffects {
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap(() =>
        this.courseService.getCourses().pipe(
          map((courses) => CourseActions.loadCoursesSuccess({ courses })),
          catchError((error) =>
            of(CourseActions.loadCoursesFailure({
              error: error.message || 'Failed to load courses',
            }))
          )
        )
      )
    )
  );

  createCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.createCourse),
      mergeMap(({ course }) =>
        this.courseService.createCourse(course).pipe(
          map((newCourse) => CourseActions.createCourseSuccess({ course: newCourse })),
          catchError((error) =>
            of(CourseActions.createCourseFailure({
              error: error.message || 'Failed to create course',
            }))
          )
        )
      )
    )
  );

  // Navigation flow after course creation
  navigateAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.createCourseSuccess),
      map(({ course }) => 
        CourseActions.navigateAfterCreate({ courseId: course._id })
      )
    )
  );

  setNavigationState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.navigateAfterCreate),
      mergeMap(({ courseId }) => [
        SectionActions.setCurrentCourse({ courseId }),
        CourseActions.setNavigationState({ courseId })
      ])
    )
  );

  completeNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.setNavigationState),
      mergeMap(({ courseId }) => {
        this.router.navigate(['/learning/sections']);
        return of(SectionActions.loadSections({ courseId }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private courseService: CourseService,
    private router: Router,
    private store: Store
  ) {}
}