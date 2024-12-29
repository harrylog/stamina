// question-form.component.ts
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  CreateQuestionDto,
  DifficultyLevel,
  QuestionType,
} from '../../../models';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
export class QuestionFormComponent {
  @Input() selectedUnitIds: string[] = [];
  @Output() submitted = new EventEmitter<CreateQuestionDto>();
  @Output() cancel = new EventEmitter<void>();

  readonly QuestionType = QuestionType;
  questionTypes = Object.values(QuestionType);
  difficultyLevels = [
    DifficultyLevel.BEGINNER,
    DifficultyLevel.INTERMEDIATE,
    DifficultyLevel.ADVANCED,
  ];

  questionForm = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', [Validators.required]],
    type: [QuestionType.MULTIPLE_CHOICE, [Validators.required]],
    options: this.fb.array([
      this.createOptionFormGroup(),
      this.createOptionFormGroup(),
    ]),
    difficulty: [DifficultyLevel.BEGINNER, [Validators.required]],
    pointsValue: [
      10,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
  });

  constructor(private fb: FormBuilder) {}

  createOptionFormGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false],
    });
  }

  get optionsArray() {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.optionsArray.push(this.createOptionFormGroup());
  }

  removeOption(index: number) {
    this.optionsArray.removeAt(index);
  }

  onSubmit() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.getRawValue();
      const options = formValue.options as Array<{
        text: string;
        isCorrect: boolean;
      }>;

      // Extract all options and correct answers
      const allOptions = options
        .map((opt) => opt.text.trim())
        .filter((text) => text.length > 0);
      const correctAnswers = options
        .filter((opt) => opt.isCorrect && opt.text.trim().length > 0)
        .map((opt) => opt.text.trim());

      console.log('Form data:', {
        allOptions,
        correctAnswers,
      });

      const questionData: CreateQuestionDto = {
        title: formValue.title!.trim(),
        content: formValue.content!.trim(),
        type: formValue.type as QuestionType,
        correctAnswers: correctAnswers, // This should be an array
        options: allOptions,
        units: this.selectedUnitIds,
        difficulty: formValue.difficulty as DifficultyLevel,
        pointsValue: formValue.pointsValue as number,
      };

      console.log('Submitting question data:', questionData);
      this.submitted.emit(questionData);
    }
    this.resetForm();
  }

  resetForm() {
    // Reset form to initial values
    this.questionForm.reset({
      title: '',
      content: '',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      pointsValue: 10,
    });

    // Clear and reinitialize options array
    while (this.optionsArray.length > 0) {
      this.optionsArray.removeAt(0);
    }

    // Add back two initial empty options
    this.optionsArray.push(this.createOptionFormGroup());
    this.optionsArray.push(this.createOptionFormGroup());

    // Mark the form as pristine and untouched
    this.questionForm.markAsPristine();
    this.questionForm.markAsUntouched();

    // Mark all child controls as untouched
    Object.keys(this.questionForm.controls).forEach((key) => {
      const control = this.questionForm.get(key);
      control?.markAsUntouched();
    });
  }
  onCancel() {
    this.cancel.emit();
  }
}
