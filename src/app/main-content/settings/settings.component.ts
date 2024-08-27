import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../models/auth.service';
import { ImprintComponent } from '../imprint/imprint.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { HelpComponent } from '../help/help.component';
import { ShareTimeService } from '../../share-time/share-time.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ImprintComponent,
    MatIconModule,
    PrivacyPolicyComponent,
    HelpComponent,
    HttpClientModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  currentContent = 'buttons';
  auth = inject(AuthService);
  shareTimeService = inject(ShareTimeService);
  showSpecificBtns = false;
  http = inject(HttpClient);
  powerStatus: '' | 'on' | 'off' = '';

  async ngOnInit():Promise<void> {
    if (this.shareTimeService.userId === 'lCGcfFZTL9PMsVpRJZJ9') {
      this.showSpecificBtns = true;
    }
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

  showManual() {
    this.currentContent = 'manual';
  }

  power(status: 'on' | 'off') {
    this.powerStatus = status; 
    if (status === 'on') {
      this.http.get('')
        .subscribe();
    } else if (status === 'off') {
      this.http.get('')
        .subscribe();
    }
    setTimeout(() => {
      this.powerStatus = '';
    }, 1000);
  }
}
