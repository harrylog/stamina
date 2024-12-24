// services/unit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUnitDto, Unit, UpdateUnitDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private sectionApiUrl = environment.apis.sections;
  private unitApiUrl = environment.apis.units;

  constructor(private http: HttpClient) {}

  getUnits(sectionId?: string): Observable<Unit[]> {
    return sectionId
      ? this.http.get<Unit[]>(`${this.sectionApiUrl}/${sectionId}/units`)
      : this.http.get<Unit[]>(this.unitApiUrl);
  }

  getUnit(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.unitApiUrl}/${id}`);
  }

  createUnit(sectionId: string, unit: CreateUnitDto): Observable<Unit> {
    const url = `${this.sectionApiUrl}/${sectionId}/units`;
    return this.http.post<Unit>(url, unit).pipe(
      catchError(error => {
        console.error('Error creating unit:', error);
        throw error;
      })
    );
  }

  updateUnit(id: string, changes: UpdateUnitDto): Observable<Unit> {
    return this.http.put<Unit>(`${this.unitApiUrl}/${id}`, changes);
  }

  deleteUnit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.unitApiUrl}/${id}`);
  }

  reorderUnits(sectionId: string, unitIds: string[]): Observable<Unit[]> {
    return this.http.put<Unit[]>(
      `${this.sectionApiUrl}/${sectionId}/units/reorder`,
      { unitIds }
    );
  }

  addQuestions(unitId: string, questionIds: string[]): Observable<Unit> {
    return this.http.put<Unit>(`${this.unitApiUrl}/${unitId}/questions`, {
      questionIds,
    });
  }

  removeQuestions(unitId: string, questionIds: string[]): Observable<Unit> {
    return this.http.delete<Unit>(`${this.unitApiUrl}/${unitId}/questions`, {
      body: { questionIds },
    });
  }

  addPrerequisites(
    unitId: string,
    prerequisiteIds: string[]
  ): Observable<Unit> {
    return this.http.put<Unit>(`${this.unitApiUrl}/${unitId}/prerequisites`, {
      prerequisiteIds,
    });
  }

  removePrerequisites(
    unitId: string,
    prerequisiteIds: string[]
  ): Observable<Unit> {
    return this.http.delete<Unit>(
      `${this.unitApiUrl}/${unitId}/prerequisites`,
      { body: { prerequisiteIds } }
    );
  }
}
