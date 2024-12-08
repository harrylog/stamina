// Core interfaces
// interface User {
//   id: string;
//   email: string;
//   username: string;
//   role: UserRole;
//   createdAt: Date;
//   lastLogin?: Date;
//   isActive: boolean;
// }

export interface User {
  id: number;
  email: string;
  password: string;
  role?: UserRole;
  name?: string;
  // Add other user properties as needed
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
