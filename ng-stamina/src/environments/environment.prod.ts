// src/environments/environment.prod.ts
import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  mockData: false,
  devMode: false,
  devUser: {
    email: '',
    password: '',
  },
  apis: {
    auth: '/api/auth',
    users: '/api/users',
    courses: '/api/courses',
    sections: '/api/sections',
    units: '/api/units',
    questions: '/api/questions',
  },
};