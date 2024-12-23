// section-form.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class SectionFormComponent implements OnInit, OnChanges {
  @Input() section: Section | null = null;
  @Input() courseId: string | null = null;
  @Output() save = new EventEmitter<CreateSectionDto | UpdateSectionDto>();
  @Output() cancel = new EventEmitter<void>();

  sectionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sectionForm = this.createForm();
  }

  get courseIdSet(): boolean {
    return !!this.sectionForm.get('courseId')?.value;
  }

  
  ngOnInit() {
    if (this.section) {
      this.sectionForm.patchValue(this.section);
    }
    if (this.courseId) {
      this.sectionForm.get('courseId')?.setValue(this.courseId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId) {
      this.sectionForm.patchValue({ courseId: this.courseId });
      // Mark courseId as touched to handle validation properly
      this.sectionForm.get('courseId')?.markAsTouched();
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

  // section-form.component.ts
  onSubmit() {
    console.log('Form State:', {
      valid: this.sectionForm.valid,
      value: this.sectionForm.value,
      errors: this.sectionForm.errors,
      courseIdValue: this.sectionForm.get('courseId')?.value,
      courseIdErrors: this.sectionForm.get('courseId')?.errors,
    });

    if (this.sectionForm.valid) {
      const formValue = this.sectionForm.value;
      this.save.emit(formValue);

      // Reset form after successful submission
      this.sectionForm.reset({
        orderIndex: 0,
        isActive: true,
        courseId: this.courseId, // Maintain the courseId
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
