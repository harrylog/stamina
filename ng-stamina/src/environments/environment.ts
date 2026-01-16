// src/environments/environment.ts
interface ApiUrls {
  auth: string;
  users: string;
  courses: string;
  sections: string;
  units: string;
  questions: string;
}

interface DevUser {
  email: string;
  password: string;
}

export interface Environment {
  production: boolean;
  mockData: boolean;
  devMode: boolean;
  devUser: DevUser;
  apis: ApiUrls;
}

export const environment: Environment = {
  production: false,
  mockData: false,
  devMode: true, // Set to false to disable auto-login
  devUser: {
    email: 'admin@dev.com',
    password: 'admin123',
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
