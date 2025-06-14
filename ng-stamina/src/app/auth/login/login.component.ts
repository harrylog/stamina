import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { AuthActions } from '../store/auth.actions';
import { selectError, selectLoading } from '../store/auth.selectors';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = '';
  private readonly store = inject(Store);
  isLoading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // this.authService.login(email!, password!).subscribe({
      //   next: () => this.router.navigate(['/auth/signup']),
      //   error: (err) => {
      //     this.errorMessage = err.error?.message || 'Login failed';
      //   },
      // });
      console.log('onSubmit()');
      this.store.dispatch(
        AuthActions.login({ email: email!, password: password! })
      );
    }
  }
}
