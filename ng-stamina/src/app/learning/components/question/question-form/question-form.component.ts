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
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
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
    type: [QuestionType.MULTIPLE_CHOICE, [Validators.required]],
    correctAnswer: ['', [Validators.required]],
    options: this.fb.array(
      [
        this.fb.control('', [Validators.required]),
        this.fb.control('', [Validators.required]),
      ],
      [Validators.required, Validators.minLength(2)]
    ),
    difficulty: [DifficultyLevel.BEGINNER, [Validators.required]],
    pointsValue: [
      10,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
  });

  get optionsArray() {
    return this.questionForm.get('options') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.questionForm.valid) {
      // Get the raw form values
      const formValue = this.questionForm.getRawValue();

      // Filter out empty options
      const filteredOptions = (formValue.options as string[]).filter(
        (option) => option.trim().length > 0
      );

      // Construct the DTO with proper typing
      const questionData: CreateQuestionDto = {
        title: formValue.title!.trim(),
        content: formValue.content!.trim(),
        type: formValue.type as QuestionType,
        correctAnswer: formValue.correctAnswer!.trim(),
        options: filteredOptions,
        units: this.selectedUnitIds,
        difficulty: formValue.difficulty as DifficultyLevel,
        pointsValue: formValue.pointsValue as number,
      };

      // Validate the constructed DTO
      if (questionData.options.length < 2) {
        console.error('At least two options are required');
        return;
      }

      if (!questionData.options.includes(questionData.correctAnswer)) {
        console.error('Correct answer must be one of the options');
        return;
      }

      console.log('Submitting question:', questionData);

      this.submitted.emit(questionData);

      // Reset form with initial values
      this.questionForm.reset({
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: DifficultyLevel.BEGINNER,
        pointsValue: 10,
      });
    } else {
      console.error('Form validation errors:', this.questionForm.errors);
      Object.keys(this.questionForm.controls).forEach((key) => {
        const control = this.questionForm.get(key);
        if (control?.errors) {
          console.error(`${key} errors:`, control.errors);
        }
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
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
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
