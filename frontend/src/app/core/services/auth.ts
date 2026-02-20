import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// This path assumes: src/app/core/services/auth/auth.ts
// Going up 4 levels gets you to the 'src' folder
import { environment } from '../../../environments/environment'; 
import { AuthResponse } from '../models/auth-response.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Login: Receives {token, role, name} from Spring Boot Map
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_role', response.role);
          localStorage.setItem('user_name', response.name);
        }
      })
    );
  }

  /**
   * Register: Receives plain text from Java
   */
  register(userData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, userData, { 
      responseType: 'text' 
    }) as Observable<string>;
  }

  // --- Helpers ---
  getToken(): string | null { return localStorage.getItem('jwt_token'); }
  getRole(): string | null { return localStorage.getItem('user_role'); }
  getUserName(): string | null { return localStorage.getItem('user_name'); }
  isLoggedIn(): boolean { return !!this.getToken(); }

  logout(): void {
    localStorage.clear(); 
    console.log('Logged out successfully');
  }
}