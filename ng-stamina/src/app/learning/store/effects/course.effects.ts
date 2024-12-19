import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CourseActions } from '../actions/course.actions';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
            of(
              CourseActions.loadCoursesFailure({
                error: error.message || 'Failed to load courses',
              })
            )
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
          map((newCourse) =>
            CourseActions.createCourseSuccess({ course: newCourse })
          ),
          catchError((error) =>
            of(
              CourseActions.createCourseFailure({
                error: error.message || 'Failed to create course',
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}
}
