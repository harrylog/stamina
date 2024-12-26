// services/question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateQuestionDto, Question, UpdateQuestionDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private sectionApiUrl = environment.apis.sections;
  private unitApiUrl = environment.apis.units;
  private questionApiUrl = environment.apis.questions;

  // Using constructor injection like UnitService instead of inject()
  constructor(private http: HttpClient) {}

  getQuestions(unitIds?: string[]): Observable<Question[]> {
    let params = new HttpParams();
    if (unitIds?.length) {
      params = params.set('unitIds', unitIds.join(','));
    }
    return this.http.get<Question[]>(this.questionApiUrl, { params });
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.questionApiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching question:', error);
        throw error;
      })
    );
  }

  createQuestion(question: CreateQuestionDto): Observable<Question> {
    return this.http.post<Question>(this.questionApiUrl, question).pipe(
      catchError((error) => {
        console.error('Error creating question:', error);
        throw error;
      })
    );
  }

  updateQuestion(id: string, changes: UpdateQuestionDto): Observable<Question> {
    return this.http
      .put<Question>(`${this.questionApiUrl}/${id}`, changes)
      .pipe(
        catchError((error) => {
          console.error('Error updating question:', error);
          throw error;
        })
      );
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.questionApiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting question:', error);
        throw error;
      })
    );
  }

  // Methods for managing question-unit relationships
  attachToUnits(questionId: string, unitIds: string[]): Observable<Question> {
    return this.http
      .put<Question>(`${this.questionApiUrl}/${questionId}/units`, { unitIds })
      .pipe(
        catchError((error) => {
          console.error('Error attaching question to units:', error);
          throw error;
        })
      );
  }

  removeFromUnits(questionId: string, unitIds: string[]): Observable<Question> {
    return this.http
      .delete<Question>(`${this.questionApiUrl}/${questionId}/units`, {
        body: { unitIds },
      })
      .pipe(
        catchError((error) => {
          console.error('Error removing question from units:', error);
          throw error;
        })
      );
  }

  // Get questions for a specific unit
  getUnitQuestions(unitId: string): Observable<Question[]> {
    return this.http
      .get<Question[]>(`${this.unitApiUrl}/${unitId}/questions`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching unit questions:', error);
          throw error;
        })
      );
  }
}
