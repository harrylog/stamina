import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import {
  QuestionActions,
  selectAllQuestions,
  selectAllUnits,
} from '../../../store';
import { CreateQuestionDto } from '../../../models';

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    QuestionFormComponent,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './question-management.component.html',
  styleUrl: './question-management.component.scss',
})
export class QuestionManagementComponent implements OnInit {
  private readonly store = inject(Store);

  questions$ = this.store.select(selectAllQuestions);
  units$ = this.store.select(selectAllUnits);
  selectedUnitIds: string[] = [];

  ngOnInit() {
    // Load initial data
    this.store.dispatch(QuestionActions.loadQuestions({}));
  }

  onUnitSelect(event: { value: string[] }) {
    this.selectedUnitIds = event.value;
    this.store.dispatch(
      QuestionActions.loadQuestions({ unitIds: this.selectedUnitIds })
    );
  }

  createQuestion(questionData: CreateQuestionDto) {
    this.store.dispatch(
      QuestionActions.createQuestion({
        question: questionData,
        unitIds: this.selectedUnitIds,
      })
    );
  }
}
