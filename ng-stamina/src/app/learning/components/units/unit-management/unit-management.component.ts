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
  selectAllSections,
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
  units$ = this.store.select(selectOrderedUnits);
  sections$ = this.store.select(selectAllSections);
  selectedUnit$ = this.store.select(selectSelectedUnit);
  selectedSectionId: string | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(SectionActions.loadSections({}));
  }

  onSectionSelect(event: { value: string }) {
    this.selectedSectionId = event.value;
    this.store.dispatch(
      UnitActions.setCurrentSection({ sectionId: event.value })
    );
    this.store.dispatch(UnitActions.loadUnits({ sectionId: event.value }));
  }

  drop(event: CdkDragDrop<Unit[]>) {
    if (event.previousIndex !== event.currentIndex && this.selectedSectionId) {
      const units = [...event.container.data];
      const updatedUnits = units.map((unit, index) => ({
        ...unit,
        orderIndex: index * 1000,
      }));

      this.store.dispatch(
        UnitActions.reorderUnits({
          sectionId: this.selectedSectionId,
          unitIds: updatedUnits.map((u) => u._id),
        })
      );
    }
  }

  selectUnit(id: string) {
    this.store.dispatch(UnitActions.selectUnit({ id }));
  }

  clearSelection() {
    this.store.dispatch(UnitActions.selectUnit({ id: null }));
  }

  // Split into separate handlers for create and update
  async onUnitFormSubmit(
    formData: CreateUnitDto | UpdateUnitDto,
    isUpdate: boolean = false
  ) {
    if (isUpdate) {
      // Get the current selected unit
      const selectedUnit = await firstValueFrom(this.selectedUnit$);
      if (selectedUnit?._id) {
        const updateData = formData as UpdateUnitDto;
        this.updateUnit(selectedUnit._id, updateData);
      }
    } else if (!isUpdate && this.selectedSectionId) {
      const createData = formData as CreateUnitDto;
      this.createUnit(createData);
    }
  }

  private createUnit(unitData: CreateUnitDto) {
    if (this.selectedSectionId) {
      const data: CreateUnitDto = {
        ...unitData,
        sectionId: this.selectedSectionId,
      };
      this.store.dispatch(UnitActions.createUnit({ unit: data }));
    }
  }

  private updateUnit(id: string, changes: UpdateUnitDto) {
    this.store.dispatch(UnitActions.updateUnit({ id, changes }));
  }

  deleteUnit(id: string) {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.store.dispatch(UnitActions.deleteUnit({ id }));
    }
  }
}
