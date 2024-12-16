import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CreateUserDto,
  UpdateUserDto,
  UserRole,
} from '../../models/user.model';
import { UserActions } from '../../store/user.actions';
import { selectLoading } from '../../store/user.selectors';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading$ = this.store.select(selectLoading);

  // Available roles for the select dropdown
  availableRoles = [
    { value: UserRole.USER, viewValue: 'Basic User' },
    { value: UserRole.ADMIN, viewValue: 'Administrator' },
    { value: UserRole.MODERATOR, viewValue: 'Moderator' },
  ];

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: [[], [Validators.required]], // Array for multiple role selection
  });

  isEditMode = false;
  userId: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = id;
      // Load user data and patch form
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.isEditMode && this.userId) {
        this.store.dispatch(
          UserActions.updateUser({
            id: this.userId,
            user: userData as UpdateUserDto,
          })
        );
        this.userForm.reset();
      } else {
        this.store.dispatch(
          UserActions.createUser({
            user: userData as CreateUserDto,
          })
        );
        this.userForm.reset();
      }
    }
  }

  // Helper methods for form validation
  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${
        control.getError('minlength').requiredLength
      } characters`;
    }
    return '';
  }
}
