import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LandingPageComponent } from '../main-content/landing-page/LandingPageComponent';
import { SettingsComponent } from '../main-content/settings/settings.component';
import { ShareTimeService } from '../share-time/share-time.service';
import { HelpComponent } from '../main-content/help/help.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    LandingPageComponent,
    SettingsComponent,
    HelpComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(
    private shareTimeService: ShareTimeService,
  ) { }

  disableEditMode() {
    this.shareTimeService.showEditDiary = false;
  }
}
