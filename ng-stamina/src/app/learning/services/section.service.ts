// section.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Section, CreateSectionDto, UpdateSectionDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private courseApiUrl = environment.apis.courses;
  private sectionApiUrl = environment.apis.sections;

  constructor(private http: HttpClient) {}

  createSection(section: CreateSectionDto): Observable<Section> {
    const { courseId, ...sectionData } = section;
    const payload = {
      ...sectionData,
      courseId, // Include courseId in the payload
    };

    console.log(
      'Service sending create request to:',
      `${this.courseApiUrl}/${courseId}/sections`
    );
    console.log('With payload:', payload);

    return this.http
      .post<Section>(`${this.courseApiUrl}/${courseId}/sections`, payload)
      .pipe(
        tap((response) => console.log('Create section response:', response)),
        catchError((error) => {
          console.error('Error creating section:', error);
          console.error('Error details:', error.error);
          throw error;
        })
      );
  }

  getSections(courseId?: string): Observable<Section[]> {
    return courseId
      ? this.http.get<Section[]>(`${this.courseApiUrl}/${courseId}/sections`)
      : this.http.get<Section[]>(this.sectionApiUrl);
  }

  getSection(id: string): Observable<Section> {
    return this.http.get<Section>(`${this.sectionApiUrl}/${id}`);
  }

  updateSection(id: string, changes: UpdateSectionDto): Observable<Section> {
    return this.http.patch<Section>(`${this.sectionApiUrl}/${id}`, changes);
  }

  deleteSection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.sectionApiUrl}/${id}`);
  }
}
