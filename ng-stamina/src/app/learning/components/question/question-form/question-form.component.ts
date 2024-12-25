import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
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
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="questionForm" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Title Field -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Title</mat-label>
        <input
          matInput
          formControlName="title"
          placeholder="Enter question title"
        />
        <mat-error *ngIf="questionForm.get('title')?.errors?.['required']">
          Title is required
        </mat-error>
      </mat-form-field>

      <!-- Content Field -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Question Content</mat-label>
        <textarea
          matInput
          formControlName="content"
          rows="4"
          placeholder="Enter the question content"
        >
        </textarea>
        <mat-error *ngIf="questionForm.get('content')?.errors?.['required']">
          Content is required
        </mat-error>
      </mat-form-field>

      <!-- Question Type -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Question Type</mat-label>
        <mat-select formControlName="type">
          <mat-option *ngFor="let type of questionTypes" [value]="type">
            {{ formatQuestionType(type) }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Correct Answer -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Correct Answer</mat-label>
        <input matInput formControlName="correctAnswer" />
      </mat-form-field>

      <!-- Options (for multiple choice) -->
      <div
        *ngIf="questionForm.get('type')?.value === QuestionType.MULTIPLE_CHOICE"
        class="space-y-4"
      >
        <h3 class="text-lg font-medium">Answer Options</h3>
        <div formArrayName="options" class="space-y-2">
          <div
            *ngFor="let option of optionsArray.controls; let i = index"
            class="flex gap-2"
          >
            <mat-form-field appearance="outline" class="flex-grow">
              <mat-label>Option {{ i + 1 }}</mat-label>
              <input matInput [formControlName]="i" />
            </mat-form-field>
            <button
              type="button"
              mat-icon-button
              color="warn"
              (click)="removeOption(i)"
              *ngIf="optionsArray.length > 2"
            >
              <mat-icon>remove_circle</mat-icon>
            </button>
          </div>
        </div>
        <button
          type="button"
          mat-stroked-button
          color="primary"
          (click)="addOption()"
        >
          Add Option
        </button>
      </div>

      <!-- Difficulty Level -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Difficulty Level</mat-label>
        <mat-select formControlName="difficulty">
          <mat-option *ngFor="let level of difficultyLevels" [value]="level">
            {{ formatDifficultyLevel(level) }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Points Value -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Points Value</mat-label>
        <input
          matInput
          type="number"
          formControlName="pointsValue"
          min="0"
          max="100"
        />
      </mat-form-field>

      <!-- Form Actions -->
      <div class="flex justify-end gap-4">
        <button type="button" mat-stroked-button (click)="onCancel()">
          Cancel
        </button>
        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="!questionForm.valid"
        >
          Create Question
        </button>
      </div>
    </form>
  `,
})
export class QuestionFormComponent {
  @Input() selectedUnitIds: string[] = [];
  @Output() submitted = new EventEmitter<CreateQuestionDto>();
  @Output() cancel = new EventEmitter<void>();

  // Make QuestionType available to the template
  readonly QuestionType = QuestionType;
  questionTypes: QuestionType[] = Object.values(QuestionType) as QuestionType[];
  difficultyLevels: DifficultyLevel[] = Object.values(
    DifficultyLevel
  ) as DifficultyLevel[];

  questionForm = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', [Validators.required]],
    type: [QuestionType.MULTIPLE_CHOICE],
    correctAnswer: ['', Validators.required],
    options: this.fb.array([this.fb.control(''), this.fb.control('')]),
    difficulty: [DifficultyLevel.BEGINNER],
    pointsValue: [10, [Validators.min(0), Validators.max(100)]],
  });

  get optionsArray() {
    return this.questionForm.get('options') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData: CreateQuestionDto = {
        ...formValue,
        units: this.selectedUnitIds,
      } as CreateQuestionDto;

      this.submitted.emit(questionData);
      this.questionForm.reset({
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.BEGINNER,
        pointsValue: 10,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  addOption() {
    this.optionsArray.push(this.fb.control(''));
  }

  removeOption(index: number) {
    this.optionsArray.removeAt(index);
  }

  formatQuestionType(type: QuestionType): string {
    // Convert enum value to string and format it
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatDifficultyLevel(level: DifficultyLevel): string {
    // Create a mapping of enum values to display strings
    const difficultyDisplayNames: Record<DifficultyLevel, string> = {
      [DifficultyLevel.BEGINNER]: 'Beginner',
      [DifficultyLevel.INTERMEDIATE]: 'Intermediate',
      [DifficultyLevel.ADVANCED]: 'Advanced',
    };

    // Use the mapping to get the display name
    return difficultyDisplayNames[level];
  }
}
