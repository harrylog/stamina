import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

import { CourseFormComponent } from '../course-form/course-form.component';
import { Course, CreateCourseDto, UpdateCourseDto } from '../../../models';
import {
  CourseActions,
  selectAllCourses,
  selectCourseLoading,
  selectSelectedCourse,
} from '../../../store';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CourseFormComponent],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss',
})
export class CourseManagementComponent implements OnInit {
  courses$: Observable<Course[]>;
  selectedCourse$: Observable<Course | null | undefined>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.courses$ = this.store.select(selectAllCourses);
    this.selectedCourse$ = this.store.select(selectSelectedCourse);
    this.loading$ = this.store.select(selectCourseLoading);
  }

  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses());
  }

  selectCourse(id: string) {
    this.store.dispatch(CourseActions.selectCourse({ id }));
  }

  clearSelection() {
    this.store.dispatch(CourseActions.selectCourse({ id: null }));
  }

  createCourse(courseData: CreateCourseDto) {
    console.log('Creating course:', courseData);
    this.store.dispatch(CourseActions.createCourse({ course: courseData }));
  }

  updateCourse(id: string, changes: UpdateCourseDto) {
    this.store.dispatch(CourseActions.updateCourse({ id, changes }));
  }

  deleteCourse(id: string) {
    if (
      confirm(
        'Are you sure you want to delete this course? This action cannot be undone.'
      )
    ) {
      this.store.dispatch(CourseActions.deleteCourse({ id }));
    }
  }
}
