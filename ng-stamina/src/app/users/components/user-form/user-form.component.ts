import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import {
  selectLoading,
  selectSelectedUserId,
  selectUserById,
} from '../../store/user.selectors';
import { filter, take } from 'rxjs';

interface UserFormModel {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  roles: FormControl<UserRole[] | null>;
}

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
  hidePassword = false;

  loading$ = this.store.select(selectLoading);
  isEditMode = false;
  pageTitle = '';

  availableRoles = [
    { value: UserRole.USER, viewValue: 'Basic User' },
    { value: UserRole.ADMIN, viewValue: 'Administrator' },
    { value: UserRole.MODERATOR, viewValue: 'Moderator' },
  ];

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    roles: [[UserRole.USER] as UserRole[], [Validators.required]],
  }) as FormGroup<UserFormModel>;

  ngOnInit() {
    // Get route data
    this.route.data.pipe(take(1)).subscribe((data) => {
      this.isEditMode = data['isEditMode'];
      this.pageTitle = data['title'];

      if (this.isEditMode) {
        const passwordControl = this.userForm.get('password');
        passwordControl?.clearValidators();
        passwordControl?.setValidators(Validators.minLength(6));
        passwordControl?.updateValueAndValidity();
      }
    });

    // Handle edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.isEditMode) {
      this.store
        .select(selectUserById(id))
        .pipe(
          filter((user): user is NonNullable<typeof user> => !!user),
          take(1)
        )
        .subscribe((user) => {
          const formData = {
            name: user.name || '',
            email: user.email,
            password: user.password, // Empty password in edit mode
            roles: user.roles || [],
          } as const;

          this.userForm.patchValue(formData, { emitEvent: false });
        });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();

      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          // If password is empty, exclude it from update
          const updateData = formData.password
            ? formData
            : { name: formData.name, email: formData.email, roles: formData.roles };

          this.store.dispatch(
            UserActions.updateUser({
              id,
              user: updateData as UpdateUserDto,
            })
          );
        }
      } else {
        this.store.dispatch(
          UserActions.createUser({
            user: formData as CreateUserDto,
          })
        );
      }

      this.userForm.reset();
      this.router.navigate(['/users']);
    }
  }

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
