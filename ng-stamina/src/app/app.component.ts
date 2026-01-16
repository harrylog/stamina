import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth/store/auth.actions';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-stamina';
  private store = inject(Store);

  ngOnInit() {
    // Auto-login in dev mode if not already authenticated
    if (environment.devMode && !localStorage.getItem('token')) {
      console.log('[DEV MODE] Initiating auto-login...');
      this.store.dispatch(AuthActions.devLogin());
    }
  }
}
