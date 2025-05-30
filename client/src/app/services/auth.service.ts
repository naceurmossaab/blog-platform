import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { AuthResponse, AuthUser } from '../models/auth';
import { environment } from '../../environments/environment.development';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth';
  private userSubject = new BehaviorSubject<AuthUser | undefined>(undefined);
  private notificationService = inject(NotificationService);

  authUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.getLoggedInUser(token).subscribe();
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.userSubject.next(response.user);
        this.notificationService.registerUser(response.user.userId);
      })
    );
  }

  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.userSubject.next(undefined);
    this.router.navigate(['/auth/login']);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
  
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  isUserLoggedIn() {
    const token = localStorage.getItem('accessToken');
    if (token) this.getLoggedInUser(token).subscribe();
  }
  
  private getLoggedInUser(token: string): Observable<{ user: AuthUser } | undefined> {
    return this.http
    .get<{ user: AuthUser }>(`${this.apiUrl}/showMe`, { withCredentials: true })
      .pipe(tap(({ user }) => { 
        this.userSubject.next(user);
        this.notificationService.registerUser(user.userId);
      }),
        catchError((error) => {
          console.error('Failed to fetch logged-in user:', error);
          this.userSubject.next(undefined);
          localStorage.removeItem('accessToken');
          this.router.navigate(['/auth/login']);
          return of(undefined);
        })
      );
  }

  hasRole(role: string | string[]): boolean {
    if (!this.userSubject.value) return false;
    if (Array.isArray(role)) return role.includes(this.userSubject.value.role);
    return this.userSubject.value.role === role;
  }
}
