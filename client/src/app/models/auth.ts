export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}