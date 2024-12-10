// src/environments/environment.ts
export interface Environment {
  production: boolean;
  mockData: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: false,
  mockData: false,
  apiUrl: 'http://localhost:3001',
};
