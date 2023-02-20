import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from "moment";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_PERMISSIONS = 'auth-user-permissions';
const ROLE_LIST = 'role_list';
const CATEGORY_LIST = 'parentcategory_list';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private router: Router) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
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

  public saveUserPermissions(permission: any): void {
    window.sessionStorage.setItem(USER_PERMISSIONS, JSON.stringify(permission));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public saveRolelist(rolelist): void {
    window.sessionStorage.removeItem(ROLE_LIST);
    window.sessionStorage.setItem(ROLE_LIST, JSON.stringify(rolelist));
  }

  public getRolelist(): any {
    const rolelist = window.sessionStorage.getItem(ROLE_LIST);
    if (rolelist) {
      return JSON.parse(rolelist);
    }
    return {};
  }

  public saveCategorylist(categorylist): void {
    window.sessionStorage.removeItem(CATEGORY_LIST);
    window.sessionStorage.setItem(CATEGORY_LIST, JSON.stringify(categorylist));
  }

  public getCategorylist(): any {
    const categorylist = window.sessionStorage.getItem(CATEGORY_LIST);
    if (categorylist) {
      return JSON.parse(categorylist);
    }
    return {};
  }

  public getUserPermissions(): any {
    const permission = window.sessionStorage.getItem(USER_PERMISSIONS);
    if (permission) {
      return JSON.parse(permission);
    }
    return {};
  }
  public getClient(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  getAuthStatus(data: any) {
    const token = this.getToken() // get token from local storage
    const expiresAt = moment().add(data.expires_in, 'second');
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('currentUserData', JSON.stringify(data.userdata));
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    localStorage.clear();
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(USER_PERMISSIONS);
    window.sessionStorage.removeItem(ROLE_LIST);
    window.sessionStorage.removeItem(CATEGORY_LIST);

    //this.router.navigateByUrl("/manage/login" ); //go to login if not authenticated
    return !this.isLoggedIn();
  }


  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}