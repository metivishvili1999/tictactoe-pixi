import { Injectable } from '@angular/core';
import * as gameData from '../gameData';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})


export class TokenStorageService {

  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
    localStorage.removeItem(gameData.data.data.user.sessionId);
    localStorage.removeItem(gameData.data.data.user.userName)
  }
  public saveToken(token : string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}

