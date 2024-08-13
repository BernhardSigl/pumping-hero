import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'user/:id', component: MainContentComponent, canActivate: [authGuard] },
];
