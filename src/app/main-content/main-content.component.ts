import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { LandingPageComponent } from './landing-page/LandingPageComponent';
import { TimerComponent } from './timer/timer.component';
import { FooterComponent } from '../../footer/footer.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    NavBarComponent,
    LandingPageComponent,
    TimerComponent,
    FooterComponent,
    MatIconModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
