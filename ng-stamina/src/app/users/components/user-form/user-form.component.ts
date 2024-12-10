import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserActions } from '../../store/user.actions';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.min(4)],
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
            user: { id: this.userId, ...(userData as Omit<User, 'id'>) },
          })
        );
      } else {
        this.store.dispatch(
          UserActions.createUser({
            user: userData as Omit<User, 'id'>,
          })
        );
      }
      this.router.navigate(['/users']);
    }
  }
}
