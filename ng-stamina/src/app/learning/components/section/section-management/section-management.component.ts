// section-management.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { SectionFormComponent } from '../section-form/section-form.component';
import {
  Section,
  CreateSectionDto,
  UpdateSectionDto,
  Course,
} from '../../../models';

import { filter, Observable, take } from 'rxjs';
import {
  CourseActions,
  SectionActions,
  selectAllCourses,
  selectAllSections,
  selectCurrentCourseId,
  selectOrderedSections,
  selectSectionsLoading,
  selectSelectedSection,
} from '../../../store';

@Component({
  selector: 'app-section-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    SectionFormComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    DragDropModule,
    MatTabGroup,
  ],
  templateUrl: './section-management.component.html',
  styleUrl: './section-management.component.scss',
})
export class SectionManagementComponent implements OnInit {
  // Change this line to use ordered sections
  sections$ = this.store.select(selectOrderedSections);
  courses$ = this.store.select(selectAllCourses);
  selectedSection$ = this.store.select(selectSelectedSection);
  loading$ = this.store.select(selectSectionsLoading);
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  selectedTabIndex = 0; // Add this property
  selectedCourseId: string | null = null;

  onCourseSelect(event: { value: string }) {
    this.selectedCourseId = event.value;
    this.store.dispatch(
      SectionActions.setCurrentCourse({ courseId: event.value })
    );
    this.store.dispatch(SectionActions.loadSections({ courseId: event.value }));
  }
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses());
    this.store
      .select(selectCurrentCourseId)
      .pipe(
        take(1),
        filter((courseId) => !!courseId)
      )
      .subscribe((courseId) => {
        if (courseId) {
          this.selectedCourseId = courseId;
          this.store.dispatch(SectionActions.loadSections({ courseId }));
          this.selectedTabIndex = 1;

          // Update the select control
          setTimeout(() => {
            const selectElement = document.querySelector('mat-select');
            if (selectElement) {
              (selectElement as any).value = courseId;
            }
          });
        }
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    // Implement drag-drop reordering
    if (event.previousIndex !== event.currentIndex) {
      // this.store.dispatch(
      //   SectionActions.reorderSection({
      //     sectionId: event.item.data,
      //     newIndex: event.currentIndex,
      //   })
      // );
    }
  }

  selectSection(id: string) {
    this.store.dispatch(SectionActions.selectSection({ id }));
  }

  clearSelection() {
    this.store.dispatch(SectionActions.selectSection({ id: null }));
  }

  createSection(sectionData: CreateSectionDto) {
    if (this.selectedCourseId) {
      const data = { ...sectionData, courseId: this.selectedCourseId };
      console.log('Creating section with data:', data); // Add this debug line
      this.store.dispatch(SectionActions.createSection({ section: data }));
    }
  }

  updateSection(id: string, changes: UpdateSectionDto) {
    this.store.dispatch(SectionActions.updateSection({ id, changes }));
  }

  deleteSection(id: string) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.store.dispatch(SectionActions.deleteSection({ id }));
    }
  }
}
