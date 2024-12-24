// store/selectors/question.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionState } from '../state/question.state';
import { questionsAdapter } from '../adapters';

// Get the questions feature state
export const selectQuestionState =
  createFeatureSelector<QuestionState>('questions');

// Get the selectors
const { selectIds, selectEntities, selectAll, selectTotal } =
  questionsAdapter.getSelectors();

// Select all questions
export const selectAllQuestions = createSelector(
  selectQuestionState,
  selectAll
);

// Select questions loading state
export const selectQuestionsLoading = createSelector(
  selectQuestionState,
  (state) => state.loading
);

// Select questions error state
export const selectQuestionsError = createSelector(
  selectQuestionState,
  (state) => state.error
);

// Select questions by unit ID
export const selectQuestionsByUnit = (unitId: string) =>
  createSelector(selectAllQuestions, (questions) =>
    questions.filter((question) => question.units?.includes(unitId))
  );

// Select questions by difficulty level
export const selectQuestionsByDifficulty = (difficulty: number) =>
  createSelector(selectAllQuestions, (questions) =>
    questions.filter((question) => question.difficulty === difficulty)
  );

// Select a specific question by ID
export const selectQuestionById = (id: string) =>
  createSelector(selectQuestionState, (state) => state.entities[id]);
