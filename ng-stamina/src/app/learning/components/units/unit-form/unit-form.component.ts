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
import { Unit, CreateUnitDto, UpdateUnitDto } from '../../../models';

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
export class UnitFormComponent implements OnInit, OnChanges {
  @Input() unit: Unit | null = null;
  @Input() sectionId: string | null = null;
  @Input() prerequisites: Unit[] = []; // Available units for prerequisites
  @Output() save = new EventEmitter<CreateUnitDto | UpdateUnitDto>();
  @Output() cancel = new EventEmitter<void>();

  unitForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.unitForm = this.createForm();
  }

  get sectionIdSet(): boolean {
    return !!this.unitForm.get('sectionId')?.value;
  }

  ngOnInit() {
    if (this.unit) {
      this.unitForm.patchValue(this.unit);
    }
    if (this.sectionId) {
      this.unitForm.patchValue({ sectionId: this.sectionId });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sectionId'] && this.sectionId) {
      this.unitForm.patchValue({ sectionId: this.sectionId });
      this.unitForm.get('sectionId')?.markAsTouched();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      sectionId: ['', Validators.required],
      orderIndex: [0],
      xpValue: [50],
      prerequisites: [[]],
    });
  }

  onSubmit() {
    if (this.unitForm.valid) {
      const formValue = this.unitForm.value;
      this.save.emit(formValue);

      this.unitForm.reset({
        orderIndex: 0,
        xpValue: 50,
        sectionId: this.sectionId,
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
