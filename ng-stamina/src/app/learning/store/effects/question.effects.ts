// store/effects/question.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Question } from '../../models';
import { QuestionActions } from '../actions';
import { QuestionService } from '../../services';

@Injectable()
export class QuestionEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly questionService = inject(QuestionService); // Use inject syntax consistently

  // Load questions effect - handles fetching questions, optionally filtered by unit
  loadQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionActions.loadQuestions),
      mergeMap(({ unitIds }) =>
        this.questionService.getQuestions(unitIds).pipe(
          map((questions) =>
            QuestionActions.loadQuestionsSuccess({ questions })
          ),
          catchError((error) =>
            of(QuestionActions.loadQuestionsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Create question effect - handles question creation and unit assignment
  // Create question effect with proper typing
  createQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionActions.createQuestion),
      switchMap(({ question, unitIds }) => {
        // Validate unit IDs are valid MongoDB ObjectIds
        const validUnitIds = unitIds.every((id) =>
          id.match(/^[0-9a-fA-F]{24}$/)
        );

        if (!validUnitIds) {
          return of(
            QuestionActions.createQuestionFailure({
              error: 'Invalid unit ID format',
            })
          );
        }

        return this.questionService
          .createQuestion({ ...question, units: unitIds })
          .pipe(
            map((createdQuestion) => {
              // Ensure the response matches the Question interface
              const typedQuestion: Question = createdQuestion;
              return QuestionActions.createQuestionSuccess({
                question: typedQuestion,
              });
            }),
            catchError((error) =>
              of(
                QuestionActions.createQuestionFailure({
                  error:
                    error.message ||
                    'An error occurred while creating the question',
                })
              )
            )
          );
      })
    )
  );

  // Update question effect - handles question updates
  updateQuestion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionActions.updateQuestion),
      mergeMap(({ id, question }) =>
        this.questionService.updateQuestion(id, question).pipe(
          map((updatedQuestion) =>
            QuestionActions.updateQuestionSuccess({ question: updatedQuestion })
          ),
          catchError((error) =>
            of(QuestionActions.updateQuestionFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Attach to units effect - handles adding questions to units
  attachToUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionActions.attachToUnits),
      mergeMap(({ questionId, unitIds }) =>
        this.questionService.attachToUnits(questionId, unitIds).pipe(
          map((updatedQuestion) =>
            QuestionActions.attachToUnitsSuccess({ question: updatedQuestion })
          ),
          catchError((error) =>
            of(QuestionActions.attachToUnitsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
