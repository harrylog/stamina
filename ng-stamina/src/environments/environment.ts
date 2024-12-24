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
    auth: 'http://localhost:3001/auth',
    users: 'http://localhost:3002/users',
    courses: 'http://localhost:3003/courses',
    sections: 'http://localhost:3003/sections',
    units: 'http://localhost:3003/units',
    questions: 'http://localhost:3003/questions',

  },
};
