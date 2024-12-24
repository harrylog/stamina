// unit-management.component.ts
import { Component, inject, OnInit } from '@angular/core';
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
import { firstValueFrom, Observable, take } from 'rxjs';
import {
  CourseActions,
  SectionActions,
  UnitActions,
  selectAllCourses,
  selectAllSections,
  selectAllUnits,
  selectCurrentSectionId,
  selectOrderedUnits,
  selectSelectedUnit,
} from '../../../store';
import { ActivatedRoute } from '@angular/router';

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
  private route = inject(ActivatedRoute);

  selectedSectionId: string | null = null;
  selectedCourseId: string | null = null;
  currentSectionId$ = this.store.select(selectCurrentSectionId);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses());
    this.route.params.subscribe((params) => {
      if (params['sectionId']) {
        this.store.dispatch(
          UnitActions.setCurrentSection({
            sectionId: params['sectionId'],
          })
        );
      }
    });
  }

  createNewUnit(unitData: Partial<CreateUnitDto>) {
    this.currentSectionId$.pipe(take(1)).subscribe((sectionId) => {
      if (!sectionId) {
        console.error('No section ID available');
        return;
      }

      this.store.dispatch(
        UnitActions.createUnit({
          sectionId,
          unit: unitData as CreateUnitDto,
        })
      );
    });
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
      this.store.dispatch(
        UnitActions.createUnit({
          sectionId: this.selectedSectionId,
          unit: unitData,
        })
      );
    }
  }

  clearSelection() {
    this.selectedSectionId = null;
  }
}
