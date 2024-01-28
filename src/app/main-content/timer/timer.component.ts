import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../edit/edit.component';

//spinning wheel
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ShareTimeService } from '../../share-time/share-time.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,

    MatCardModule, MatRadioModule, FormsModule, MatSliderModule, MatProgressSpinnerModule
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';

  initialValue = 0;
  finaleValue = 60;

  userId!: string;
  userVariables: any[] = [];

  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  startTimer: any;

  currentTime: string = '';

  // Fullscreen:
  elem: any;
  isFullScreen!: boolean;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public shareTimeService: ShareTimeService,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.shareTimeService.subUsers(this.userId);
    this.showCurrentTime();

    // Fullscreen:
    this.chkScreenMode();
    this.elem = document.documentElement;
  }

  openEditIntervalCard() {
    this.dialog.open(EditComponent, {
      data: { userId: this.userId, userVariables: this.shareTimeService.userVariables },
    });
  }

  start(): void {
    if (!this.shareTimeService.running) {
      this.shareTimeService.running = true;
      this.shareTimeService.logCurrentTime();
      this.startTimer = setInterval(() => {
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;

        if (this.ms === 100) {
          this.sec++;
          this.shareTimeService.secAlert++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms = '0' + 0;
        }

        if (this.sec === 60) {
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
        }

        if (this.min === 60) {
          this.hr++;
          this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
          this.hr = '0' + 0;
        }
      }, 10);
    } else {
      this.stop();
    }
  }

  stop(): void {
    clearInterval(this.startTimer);
    clearInterval(this.shareTimeService.startTimerAlert);
    this.shareTimeService.running = false;
  }

  reset(): void {
    clearInterval(this.startTimer);
    clearInterval(this.shareTimeService.startTimerAlert);
    this.shareTimeService.running = false;
    this.hr = this.min = this.sec = this.ms = '0' + 0;
    this.shareTimeService.secAlert = 0;
    this.shareTimeService.value = 0;
  }

  showCurrentTime() {
    const now = new Date();
    const hours = this.addZero(now.getHours());
    const minutes = this.addZero(now.getMinutes());
    this.currentTime = `${hours}:${minutes}`;
    setTimeout(() => this.showCurrentTime(), 6000);
  }

  addZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }


  // Fullscreen:
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])

  chkScreenMode() {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}
