import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../models/auth.service';
import { ImprintComponent } from '../imprint/imprint.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ImprintComponent,
    MatIconModule,
    PrivacyPolicyComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  currentContent = 'buttons';
  auth = inject(AuthService);

  signOut() {
    sessionStorage.removeItem('loggedInUser');
    this.auth.signOut();
  }

  showButtons() {
    this.currentContent = 'buttons';
  }

  showImprint() {
    this.currentContent = 'imprint';
  }

  showPrivacyPolicy() {
    this.currentContent = 'privacy-policy';
  }
}
