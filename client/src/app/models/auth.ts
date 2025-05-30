export interface AuthUser {
  _id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}