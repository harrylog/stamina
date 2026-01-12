// src/environments/environment.ts
interface ApiUrls {
  auth: string;
  users: string;
  courses: string;
  sections: string;
  units: string;
  questions:string
}

export interface Environment {
  production: boolean;
  mockData: boolean;
  apis: ApiUrls;
}

export const environment: Environment = {
  production: false,
  mockData: false,
  apis: {
    auth: '/api/auth',
    users: '/api/users',
    courses: '/api/courses',
    sections: '/api/sections',
    units: '/api/units',
    questions: '/api/questions',
  },
};
