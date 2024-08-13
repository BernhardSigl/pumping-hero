import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { signOut as firebaseSignOut } from '@firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    router = inject(Router);
    constructor() { }

    async signOut(): Promise<void> {
        try {
          await firebaseSignOut(this.auth);
          localStorage.removeItem('email');
          localStorage.removeItem('password');
          localStorage.removeItem('rememberMe');
          sessionStorage.removeItem('loggedInUser');
          this.router.navigate(['/']);
        } catch (error) {
          console.error('Error during sign out:', error);
        }
      }
}