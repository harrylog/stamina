import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './users/store/user.reducer';
import { UserEffects } from './users/store/user.effects';
import { environment } from '../environments';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { authReducer } from './auth/store/auth.reducer';
import { authEffects } from './auth/store/auth.effects';
import { courseReducer } from './learning/store/reducers/course.reducer';
import { CourseEffects } from './learning/store/effects/course.effects';
import { SectionEffects } from './learning/store/effects/section.effects';
import { sectionReducer } from './learning/store/reducers/section.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
    provideStore({
      user: userReducer,
      router: routerReducer,
      auth: authReducer,
      courses: courseReducer, 
      sections: sectionReducer,
    }),
    provideEffects(UserEffects, authEffects, CourseEffects, SectionEffects),

    provideRouterStore(),
  ],
};
