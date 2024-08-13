import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  console.log('Auth Guard executed');

  return new Observable<boolean>((observer) => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          console.log('User authenticated:', user);
          observer.next(true);
        } else {
          console.log('User not authenticated');
          router.navigate(['']);
          observer.next(false);
        }
        observer.complete();
      },
      (err) => {
        console.error('Auth state error:', err);
        observer.error(err);
      }
    );

    return unsubscribe;
  });
};
