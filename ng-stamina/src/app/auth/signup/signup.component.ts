import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
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
    MatSlideToggleModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = '';
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectAuthError);
  hidePassword = false ;

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        //Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      ],
    ],
    name: [''],
  });

  constructor(private fb: FormBuilder, private store: Store) {}

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signup(email!, password!).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Signup error in component:', error);
          if (error.status === 500) {
            this.errorMessage = 'Server error occurred. Please try again.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred';
          }
        },
      });
    }
  }
}
function selectIsLoading(state: object): unknown {
  throw new Error('Function not implemented.');
}

function selectAuthError(state: object): unknown {
  throw new Error('Function not implemented.');
}

