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
export class UnitFormComponent implements OnInit, OnChanges {
  @Input() unit: Unit | null = null;
  @Input() sectionId: string | null = null;
  @Input() prerequisites: Unit[] = []; // Available units for prerequisites
  @Output() save = new EventEmitter<CreateUnitDto | UpdateUnitDto>();
  @Output() cancel = new EventEmitter<void>();

  @Input() courses: Course[] = [];
  unitForm: FormGroup;

  sections$ = new BehaviorSubject<Section[]>([]);
  selectedCourseId: string | null = null;

  constructor(private fb: FormBuilder, private sectionService: SectionService) {
    this.unitForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      courseId: ['', Validators.required],
      sectionId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      orderIndex: [0],
      xpValue: [50],
      prerequisites: [[]],
    });
  }

  onCourseSelect(courseId: string) {
    this.selectedCourseId = courseId;
    this.unitForm.get('sectionId')?.setValue('');

    if (courseId) {
      this.sectionService
        .getSections(courseId)
        .subscribe((sections) => this.sections$.next(sections));
    } else {
      this.sections$.next([]);
    }
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
