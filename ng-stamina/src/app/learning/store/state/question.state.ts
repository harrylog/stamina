import { EntityState } from "@ngrx/entity";
import { Question } from "../../models";
import { questionsAdapter } from "../adapters";

export interface QuestionState extends EntityState<Question> {
    selectedId: string | null;
    loading: boolean;
    error: any;
  }
  
  export const initialQuestionState: QuestionState = questionsAdapter.getInitialState({
    selectedId: null,
    loading: false,
    error: null
  });