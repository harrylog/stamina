import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import {
  Unit,
  CreateUnitDto,
  UpdateUnitDto,
  Course,
  Section,
} from '../../../models';
import { SectionService } from '../../../services';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
  ],
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss'],
})
export class UnitFormComponent {
  @Input() unit: Unit | null = null;
  @Input() sectionId: string | null = null;
  @Output() save = new EventEmitter<CreateUnitDto>();
  @Output() cancel = new EventEmitter<void>();

  unitForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.unitForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      xpValue: [50],
      sectionId: [''],
    });
  }

  onSubmit() {
    if (this.unitForm.valid && this.sectionId) {
      const formValue = this.unitForm.value;
      const unitData: CreateUnitDto = {
        ...formValue,
        sectionId: this.sectionId,
      };
      this.save.emit(unitData);
      this.unitForm.reset({
        xpValue: 50,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
