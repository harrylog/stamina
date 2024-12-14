// src/environments/environment.ts
interface ApiUrls {
  auth: string;
  users: string;
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
    auth: 'http://localhost:3001',
    users: 'http://localhost:3002',
  },
};
