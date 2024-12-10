export interface User {
  id: string;
  email: string;
  password: string;
  role?: UserRole;
  name?: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR', // Optional, for future use
}

// NgRx State interface
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
