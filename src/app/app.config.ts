import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'simplefit-411215',
        appId: '1:48091826759:web:bcd9bc0bcf27597e41bf62',
        storageBucket: 'simplefit-411215.appspot.com',
        apiKey: 'AIzaSyDCKYbFyzDhKgeMf1PXbNp1EEmtbQnqK2Q',
        authDomain: 'simplefit-411215.firebaseapp.com',
        messagingSenderId: '48091826759',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
