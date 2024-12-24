import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CreateQuestionDto,
  DifficultyLevel,
  QuestionType,
} from '../../../models';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatOptionModule,
  ],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss',
})
export class QuestionFormComponent {
  @Output() submitted = new EventEmitter<CreateQuestionDto>();

  questionForm = inject(FormBuilder).group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    content: ['', Validators.required],
    type: [QuestionType.MULTIPLE_CHOICE, Validators.required],
    correctAnswer: ['', Validators.required],
    options: [[], Validators.required],
    difficulty: [DifficultyLevel.BEGINNER],
    pointsValue: [10],
  });

  questionTypes = Object.values(QuestionType);

  onSubmit() {
    if (this.questionForm.valid) {
      this.submitted.emit(this.questionForm.value as any);
    }
  }
}
