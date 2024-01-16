import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LandingPageComponent } from '../main-content/landing-page/LandingPageComponent';
import { SettingsComponent } from '../main-content/settings/settings.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    LandingPageComponent,
    SettingsComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

}
