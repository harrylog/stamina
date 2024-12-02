export interface TokenPayload {
  userId: string;
}

// lib/common/interfaces/auth.interface.ts
export interface IAuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
}

// Extend the Express Request type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IAuthenticatedUser;
    }
  }
}
