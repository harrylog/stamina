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
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Question Management</h1>

      <!-- Hierarchical Selection -->
      <div class="mb-6 space-y-4 bg-white rounded-lg shadow p-4">
        <!-- Course Selection -->
        <mat-form-field class="w-full">
          <mat-label>Select Course</mat-label>
          <mat-select
            [(ngModel)]="selectedCourseId"
            (selectionChange)="onCourseSelect($event)"
          >
            <mat-option
              *ngFor="let course of courses$ | async"
              [value]="course._id"
            >
              {{ course.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Section Selection (enabled only if course is selected) -->
        <mat-form-field class="w-full">
          <mat-label>Select Section</mat-label>
          <mat-select
            [(ngModel)]="selectedSectionId"
            (selectionChange)="onSectionSelect($event)"
            [disabled]="!selectedCourseId"
          >
            <mat-option
              *ngFor="let section of sections$ | async"
              [value]="section._id"
            >
              {{ section.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Unit Selection (enabled only if section is selected) -->
        <mat-form-field class="w-full">
          <mat-label>Select Units</mat-label>
          <mat-select
            [value]="selectedUnitIds"
            multiple
            (selectionChange)="onUnitSelect($event)"
            [disabled]="!selectedSectionId"
          >
            <mat-option *ngFor="let unit of units$ | async" [value]="unit._id">
              {{ unit.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Selected Units Display -->
        <div *ngIf="selectedUnitIds.length" class="flex flex-wrap gap-2">
          <mat-chip-set>
            <mat-chip
              *ngFor="let unitId of selectedUnitIds"
              [removable]="true"
              (removed)="removeUnit(unitId)"
            >
              {{ getUnitTitle(unitId) }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Tabs Container -->
      <mat-tab-group class="bg-white rounded-lg shadow">
        <!-- Questions List -->
        <mat-tab label="Questions List">
          <div class="p-4">
            <div *ngIf="loading$ | async" class="text-center py-4">
              Loading questions...
            </div>

            <div
              *ngIf="!(loading$ | async) && selectedUnitIds.length === 0"
              class="text-center py-4 text-gray-500"
            >
              Please select at least one unit to view its questions
            </div>

            <div
              *ngIf="!(loading$ | async) && selectedUnitIds.length > 0"
              class="grid gap-4"
            >
              <div
                *ngFor="let question of questions$ | async"
                class="border rounded p-4 hover:bg-gray-50"
              >
                <h3 class="font-semibold">{{ question.title }}</h3>
                <p class="text-gray-600 mt-2">{{ question.content }}</p>
                <div class="mt-2 flex gap-2">
                  <span class="text-sm text-blue-600">
                    Points: {{ question.pointsValue }}
                  </span>
                  <span class="text-sm text-purple-600">
                    Difficulty: {{ formatDifficulty(question.difficulty) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Create Question -->
        <mat-tab
          label="Create Question"
          [disabled]="selectedUnitIds.length === 0"
        >
          <div class="p-4">
            <app-question-form
              [selectedUnitIds]="selectedUnitIds"
              (submitted)="createQuestion($event)"
              (cancel)="clearSelection()"
            >
            </app-question-form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
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
