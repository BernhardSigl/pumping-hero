import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../edit/edit.component';

//spinning wheel
import { ThemePalette } from '@angular/material/core';
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
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

    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'determinate';

  initialValue = 0;
  finaleValue = 60;

  userId!: string;
  userVariables: any[] = [];

  ms: number = 0;
  sec: number = 0;
  min: number = 0;
  hr: number = 0;
  secFormatted: string = '00';
  minFormatted: string = '00';
  hrFormatted: string = '00';

  startTimer: any;

  currentTime: string = '';

  isCountdownActive: boolean = false;
  countdownSec: number | undefined;
  countdownTimer: any;

  // Fullscreen:
  elem: any;
  isFullScreen!: boolean;

  lastExerciseImage!: string;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public shareTimeService: ShareTimeService,
    @Inject(DOCUMENT) private document: any
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.shareTimeService.subUsers(this.userId);
    this.showCurrentTime();

    // Fullscreen:
    this.chkScreenMode();
    this.elem = document.documentElement;
    await this.shareTimeService.getLastSavedExercise();
  }

  openEditIntervalCard() {
    this.dialog.open(EditComponent, {
      data: {
        userId: this.userId,
        userVariables: this.shareTimeService.userVariables,
      },
      position: { top: '90px' },
      width: '90%',
    });
  }

  async startWithDelay(): Promise<void> {
    if (!this.shareTimeService.running) {
      this.isCountdownActive = true;
      this.countdownSec = 10;
      this.countdownTimer = setInterval(() => {
        if (this.countdownSec && this.countdownSec > 0) {
          this.countdownSec--;
        } else {
          clearInterval(this.countdownTimer);
          this.isCountdownActive = false;
          this.start();
        }
      }, 1000);
    } else {
      this.start();
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatTime(time: number): string {
    return time < 10 ? '0' + time : String(time);
  }

  start(): void {
    this.isCountdownActive = false;
    if (!this.shareTimeService.running) {
      this.shareTimeService.running = true;
      this.shareTimeService.logCurrentTime();
      let previousTime = performance.now();
      let msAccumulator = 0;
      this.startTimer = setInterval(() => {
        const now = performance.now();
        const deltaTime = now - previousTime;
        previousTime = now;
        msAccumulator += deltaTime;
        while (msAccumulator >= 1000) {
          this.sec++;
          this.shareTimeService.secAlert++;
          msAccumulator -= 1000;
          if (this.sec >= 60) {
            this.sec = 0;
            this.min++;
          }
          if (this.min >= 60) {
            this.min = 0;
            this.hr++;
          }
          this.secFormatted = this.formatTimeWithZero(this.sec);
          this.minFormatted = this.formatTimeWithZero(this.min);
          this.hrFormatted = this.formatTimeWithZero(this.hr);
        }
        this.ms = Math.floor(msAccumulator / 10);
      }, 10);
    } else {
      this.stop();
    }
  }

  formatTimeWithZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  
  stop(): void {
    clearInterval(this.startTimer);
    clearInterval(this.shareTimeService.startTimerAlert);
    this.shareTimeService.running = false;
  }

  reset(): void {
    if (this.isCountdownActive) {
      clearInterval(this.countdownTimer);
      this.countdownSec = undefined;
      this.isCountdownActive = false;
    } else {
      clearInterval(this.startTimer);
      clearInterval(this.shareTimeService.startTimerAlert);
      this.shareTimeService.running = false;
      this.hr = this.min = this.sec = this.ms = 0;
      this.secFormatted = this.formatTimeWithZero(this.sec);
      this.minFormatted = this.formatTimeWithZero(this.min);
      this.hrFormatted = this.formatTimeWithZero(this.hr);
      this.shareTimeService.secAlert = 0;
      this.shareTimeService.value = 0;
    }
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
