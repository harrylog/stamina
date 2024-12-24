// unit-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

import { UnitFormComponent } from '../unit-form/unit-form.component';
import { Unit, CreateUnitDto, UpdateUnitDto } from '../../../models';
import { firstValueFrom, Observable } from 'rxjs';
import {
  CourseActions,
  SectionActions,
  UnitActions,
  selectAllCourses,
  selectAllSections,
  selectAllUnits,
  selectOrderedUnits,
  selectSelectedUnit,
} from '../../../store';

@Component({
  selector: 'app-unit-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    UnitFormComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    DragDropModule,
  ],
  templateUrl: './unit-management.component.html',
  styleUrls: ['./unit-management.component.scss'],
})
export class UnitManagementComponent implements OnInit {
  units$ = this.store.select(selectAllUnits);
  sections$ = this.store.select(selectAllSections);
  courses$ = this.store.select(selectAllCourses);

  selectedSectionId: string | null = null;
  selectedCourseId: string | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses());
  }

  onCourseSelect(event: { value: string }) {
    this.selectedCourseId = event.value;
    this.selectedSectionId = null;
    this.store.dispatch(SectionActions.loadSections({ courseId: event.value }));
  }

  onSectionSelect(event: { value: string }) {
    this.selectedSectionId = event.value;
    this.store.dispatch(UnitActions.loadUnits({ sectionId: event.value }));
  }

  createUnit(unitData: CreateUnitDto) {
    if (this.selectedSectionId) {
      this.store.dispatch(UnitActions.createUnit({ unit: unitData }));
    }
  }

  clearSelection() {
    this.selectedSectionId = null;
  }
}
