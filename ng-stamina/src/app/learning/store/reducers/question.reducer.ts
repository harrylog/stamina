// store/reducers/question.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { QuestionState } from '../state/question.state';
import { QuestionActions } from '../actions';
import { questionsAdapter } from '../adapters';

export const initialQuestionState: QuestionState =
  questionsAdapter.getInitialState({
    selectedId: null,
    loading: false,
    error: null,
  });

export const questionReducer = createReducer(
  initialQuestionState,

  // Loading actions
  on(QuestionActions.loadQuestions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionActions.loadQuestionsSuccess, (state, { questions }) =>
    questionsAdapter.setAll(questions, {
      ...state,
      loading: false,
    })
  ),

  on(QuestionActions.loadQuestionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create actions
  on(QuestionActions.createQuestion, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionActions.createQuestionSuccess, (state, { question }) =>
    questionsAdapter.addOne(question, {
      ...state,
      loading: false,
    })
  ),

  on(QuestionActions.createQuestionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update actions
  on(QuestionActions.updateQuestion, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionActions.updateQuestionSuccess, (state, { question }) =>
    questionsAdapter.updateOne(
      { id: question._id, changes: question },
      { ...state, loading: false }
    )
  ),

  // Attach to units actions
  on(QuestionActions.attachToUnits, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(QuestionActions.attachToUnitsSuccess, (state, { question }) =>
    questionsAdapter.updateOne(
      { id: question._id, changes: question },
      { ...state, loading: false }
    )
  )
);
