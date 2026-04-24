import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginCredentials, AuthResponse, AuthTokens } from '../../shared/models/auth.model';
import { User, CreateUserPayload } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getAccessToken() && !!this.currentUser;
  }

  login(credentials: LoginCredentials): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(
      `${this.apiUrl}/auth/login/`, credentials
    ).pipe(
      tap(tokens => {
        this.saveTokens(tokens);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  register(payload: CreateUserPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/register/`, payload
    ).pipe(
      tap(response => {
        this.saveTokens(response.tokens);
        this.currentUserSubject.next(response.user);
        localStorage.setItem('current_user', JSON.stringify(response.user));
      })
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile/`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('current_user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(
      `${this.apiUrl}/auth/token/refresh/`,
      { refresh: this.getRefreshToken() }
    ).pipe(tap(tokens => this.saveTokens(tokens)));
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
}