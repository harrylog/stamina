export interface User {
  id?: string;
  email: string;
  password: string;
  roles?: UserRole[];
  name?: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  _id?: string; // MongoDB typically uses _id
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR', // Optional, for future use
}

