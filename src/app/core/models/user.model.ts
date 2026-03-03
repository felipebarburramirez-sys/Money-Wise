export type UserRole = 'USER';

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
}

export interface StoredUser extends User {
  password: string; // MVP fake local
}
