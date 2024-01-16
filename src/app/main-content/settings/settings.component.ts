import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../models/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  auth = inject(AuthService);

  signOut() {
    sessionStorage.removeItem('loggedInUser');
    this.auth.signOut();
  }
}
