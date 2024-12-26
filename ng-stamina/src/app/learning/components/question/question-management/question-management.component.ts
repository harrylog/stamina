import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  CourseActions,
  SectionActions,
  UnitActions,
  QuestionActions,
  selectAllCourses,
  selectAllSections,
  selectAllUnits,
  selectAllQuestions,
} from '../../../store';
import { QuestionFormComponent } from '../question-form/question-form.component';
import { CreateQuestionDto, DifficultyLevel } from '../../../models';

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    QuestionFormComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss'],
})
export class QuestionManagementComponent implements OnInit {
  private readonly store = inject(Store);

  courses$ = this.store.select(selectAllCourses);
  sections$ = this.store.select(selectAllSections);
  units$ = this.store.select(selectAllUnits);
  questions$ = this.store.select(selectAllQuestions);
  loading$ = this.store.select((state) => state.questions.loading);

  selectedCourseId: string | null = null;
  selectedSectionId: string | null = null;
  selectedUnitIds: string[] = [];

  private unitMap = new Map<string, string>();

  ngOnInit() {
    // Load initial courses
    this.store.dispatch(CourseActions.loadCourses());

    // Subscribe to units to maintain unit title mapping
    this.units$.subscribe((units) => {
      this.unitMap.clear();
      units.forEach((unit) => this.unitMap.set(unit._id, unit.title));
    });
  }

  onCourseSelect(event: { value: string }) {
    this.selectedCourseId = event.value;
    this.selectedSectionId = null;
    this.selectedUnitIds = [];
    // Load sections for selected course
    this.store.dispatch(
      SectionActions.loadSections({
        courseId: event.value,
      })
    );
  }

  onSectionSelect(event: { value: string }) {
    this.selectedSectionId = event.value;
    this.selectedUnitIds = [];
    // Load units for selected section
    this.store.dispatch(
      UnitActions.loadUnits({
        sectionId: event.value,
      })
    );
  }

  onUnitSelect(event: { value: string[] }) {
    this.selectedUnitIds = event.value;
    if (this.selectedUnitIds.length > 0) {
      this.loadQuestions();
    }
  }

  removeUnit(unitId: string) {
    this.selectedUnitIds = this.selectedUnitIds.filter((id) => id !== unitId);
    if (this.selectedUnitIds.length > 0) {
      this.loadQuestions();
    }
  }

  loadQuestions() {
    this.store.dispatch(
      QuestionActions.loadQuestions({
        unitIds: this.selectedUnitIds,
      })
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

  clearSelection() {
    this.selectedUnitIds = [];
  }

  getUnitTitle(unitId: string): string {
    return this.unitMap.get(unitId) || 'Unknown Unit';
  }

  formatDifficulty(level: DifficultyLevel): string {
    const difficultyMap: Record<DifficultyLevel, string> = {
      [DifficultyLevel.BEGINNER]: 'Beginner',
      [DifficultyLevel.INTERMEDIATE]: 'Intermediate',
      [DifficultyLevel.ADVANCED]: 'Advanced',
    };
    return difficultyMap[level];
  }
}
