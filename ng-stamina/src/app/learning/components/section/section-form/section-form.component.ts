// section-form.component.ts
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
import { Section, CreateSectionDto, UpdateSectionDto } from '../../../models';

@Component({
  selector: 'app-section-form',
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
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.scss',
})
export class SectionFormComponent implements OnInit {
  @Input() section: Section | null = null;
  @Input() courseId: string | null = null;
  @Output() save = new EventEmitter<CreateSectionDto | UpdateSectionDto>();
  @Output() cancel = new EventEmitter<void>();

  sectionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sectionForm = this.createForm();
  }

  ngOnInit() {
    if (this.section) {
      this.sectionForm.patchValue(this.section);
    }
    if (this.courseId) {
      this.sectionForm.get('courseId')?.setValue(this.courseId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      courseId: ['', Validators.required],
      orderIndex: [0],
      isActive: [true],
    });
  }

  onSubmit() {
    if (this.sectionForm.valid) {
      const formValue = this.sectionForm.value;
      this.save.emit(formValue);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}