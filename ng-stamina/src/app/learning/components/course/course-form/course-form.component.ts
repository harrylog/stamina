import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { Course, CreateCourseDto, UpdateCourseDto } from '../../../models';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() save = new EventEmitter<CreateCourseDto | UpdateCourseDto>();
  @Output() cancel = new EventEmitter<void>();

  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.createForm();
  }

  ngOnInit() {
    if (this.course) {
      this.courseForm.patchValue(this.course);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      technology: ['', Validators.required],
      difficulty: [0],
      isActive: [true],
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      this.save.emit(formValue);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
