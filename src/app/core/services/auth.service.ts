import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../Interfaces/Authorization/LoginResponse';
import { environment } from '../../../enviroment/enviroment';
import { LoginRequest } from '../Interfaces/Authorization/LoginRequest';
import { UserInfo } from '../Interfaces/UserInfo';
import { Tokens } from '../Interfaces/Authorization/TokensInterfaces';
import { RefreshTokenResponse } from '../Interfaces/Authorization/RefreshTokenResponse';
import { Token } from '../Interfaces/Authorization/TokenInterface';
import { Roles } from 'config/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //* Injections
  private readonly _http = inject(HttpClient);

  //* Base URL
  private readonly baseURL: string = `${environment.apiUrl}/authorization`;

  //* General Variables
  private user: UserInfo | null = null;

  login(body: LoginRequest): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.baseURL}/login`, body);
  }

  refreshAccessTokenRequest(token: string): Observable<RefreshTokenResponse> {
    const body = {
      refreshToken: token
    }
    return this._http.post<RefreshTokenResponse>(`${this.baseURL}/refresh`, body
    );
  }

  saveTokens(tokens: Tokens): void {
    const accessToken = JSON.stringify(tokens.accessToken);
    localStorage.setItem('accessToken', accessToken);
    const refreshToken = JSON.stringify(tokens.refreshToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  saveUser(user: UserInfo) {
    const userString = JSON.stringify(user);
    localStorage.setItem('user', userString);
    this.user = user;
  }

  saveNewAccessToken(token: Token): void {
    const accessToken = JSON.stringify(token);
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): Token | null {

    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? JSON.parse(accessToken) : null;
  }

  getRefreshToken(): Token | null {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken ? JSON.parse(refreshToken) : null;
  }


  getUser(): UserInfo | null {
    if (this.user) {
      return this.user;
    }

    const userString = localStorage.getItem('user');

    return userString ? JSON.parse(userString!) : null;
  }

  deleteSession(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.clear();
  }

}
