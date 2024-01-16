import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"simplefit-411215","appId":"1:48091826759:web:bcd9bc0bcf27597e41bf62","storageBucket":"simplefit-411215.appspot.com","apiKey":"AIzaSyDCKYbFyzDhKgeMf1PXbNp1EEmtbQnqK2Q","authDomain":"simplefit-411215.firebaseapp.com","messagingSenderId":"48091826759"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
