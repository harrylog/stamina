import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateSectionDto, Section, UpdateSectionDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private apiUrl = `${environment.apis.courses}`; // We'll need to add this to environment

  constructor(private http: HttpClient) {}

  getSections(courseId?: string): Observable<Section[]> {
    // If courseId is provided, we'll filter sections for that course
    const url = courseId ? `${this.apiUrl}?courseId=${courseId}` : this.apiUrl;
    return this.http.get<Section[]>(url);
  }

  getSectionById(id: string): Observable<Section> {
    return this.http.get<Section>(`${this.apiUrl}/${id}`);
  }

  createSection(section: CreateSectionDto): Observable<Section> {
    return this.http.post<Section>(this.apiUrl, section);
  }

  updateSection(id: string, changes: UpdateSectionDto): Observable<Section> {
    return this.http.patch<Section>(`${this.apiUrl}/${id}`, changes);
  }

  deleteSection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
