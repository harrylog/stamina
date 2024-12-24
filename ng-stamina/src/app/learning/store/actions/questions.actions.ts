// questions.actions.ts
import { createActionGroup, props } from '@ngrx/store';
import { CreateQuestionDto, Question, UpdateQuestionDto } from '../../models';

export const QuestionActions = createActionGroup({
  source: 'Question',
  events: {
    // Load questions
    'Load Questions': props<{ unitIds?: string[] }>(),
    'Load Questions Success': props<{ questions: Question[] }>(),
    'Load Questions Failure': props<{ error: any }>(),

    // Create question
    'Create Question': props<{ question: CreateQuestionDto; unitIds: string[] }>(),
    'Create Question Success': props<{ question: Question }>(),
    'Create Question Failure': props<{ error: any }>(),

    // Update question
    'Update Question': props<{ id: string; question: UpdateQuestionDto }>(),
    'Update Question Success': props<{ question: Question }>(),
    'Update Question Failure': props<{ error: any }>(),

    // Delete question
    'Delete Question': props<{ id: string }>(),
    'Delete Question Success': props<{ id: string }>(),
    'Delete Question Failure': props<{ error: any }>(),

    // Attach to units
    'Attach To Units': props<{ questionId: string; unitIds: string[] }>(),
    'Attach To Units Success': props<{ question: Question }>(),
    'Attach To Units Failure': props<{ error: any }>(),
  }
});