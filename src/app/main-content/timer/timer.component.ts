import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../edit/edit.component';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { LandingPageComponent } from '../landing-page/LandingPageComponent';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  AUDIO_MAIN_ALERT = new Audio('./../../../assets/sounds/main-alert.mp3');
  AUDIO_PRE_ALERT = new Audio('./../../../assets/sounds/pre-alert.mp3');

  user!: User;
  userId!: string;
  userVariables: any[] = [];

  firstIntervalMin!: number;
  secondIntervalMin!: number;
  firstPreIntervalMin!: number;
  secondPreIntervalMin!: number;

  firstIntervalSec!: number;
  secondIntervalSec!: number;
  firstPreIntervalSec!: number;
  secondPreIntervalSec!: number;

  intervalConvert!: any;
  preIntervalConvert!: any;

  ms: any = '0' + 0;
  sec: any = '0' + 0;
  secAlert: number = 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  startTimer: any;
  startTimerAlert: any;
  running = false;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private landingPage: LandingPageComponent) {
    // btn booleans
    this.landingPage.activeFirstInterval;
    this.landingPage.activeSecondInterval;
    this.landingPage.activeFirstPreInterval;
    this.landingPage.activeSecondPreInterval;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.subUsers();
  }

  subUsers() {
    const q = this.getSingleUserDocRef(this.userId);
    onSnapshot(q, (querySnapshot) => {
      let userField = querySnapshot.data();
      this.userVariables.pop(); // aktuallisiert potenzielle Änderungen
      this.userVariables.push(userField);
      const userVariable = this.userVariables[0];

      this.firstIntervalMin = userVariable.firstIntervalMin;
      this.secondIntervalMin = userVariable.secondIntervalMin;
      this.firstPreIntervalMin = userVariable.firstPreIntervalMin;
      this.secondPreIntervalMin = userVariable.secondPreIntervalMin;

      this.firstIntervalSec = userVariable.firstIntervalSec;
      this.secondIntervalSec = userVariable.secondIntervalSec;
      this.firstPreIntervalSec = userVariable.firstPreIntervalSec;
      this.secondPreIntervalSec = userVariable.secondPreIntervalSec;
    });
  }

  getUsersColRef() {
    return collection(this.firestore, "users");
  }

  getSingleUserDocRef(docId: string) {
    return doc(this.getUsersColRef(), docId);
  }

  openEditIntervalCard() {
    this.dialog.open(EditComponent, {
      data: { userId: this.userId, userVariables: this.userVariables },
    });
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.logCurrentTime();
      this.startTimer = setInterval(() => {
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;

        if (this.ms === 100) {
          this.sec++;
          this.secAlert++;
          this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
          this.ms = '0' + 0;
        }

        if (this.sec === 60) {
          this.min++;
          this.min = this.min < 10 ? '0' + this.min : this.min;
          this.sec = '0' + 0;
          // this.logCurrentTime(this.sec)
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
    clearInterval(this.startTimerAlert);
    this.running = false;
  }

  reset(): void {
    clearInterval(this.startTimer);
    clearInterval(this.startTimerAlert);
    this.running = false;
    this.hr = this.min = this.sec = this.ms = '0' + 0;
    this.secAlert = 0;
  }

  logCurrentTime() {
    if (this.checkActiveInterval()) {
      this.startTimerAlert = setInterval(() => {
        this.intervalCalc();
        this.preIntervalCalc();
        this.playIntervalSound();
        this.playPreIntervalSound();
      }, 10);
    }
  }

  checkActiveInterval() {
    return this.landingPage.activeFirstInterval || this.landingPage.activeSecondInterval;
  }

  intervalCalc() {
    if (this.landingPage.activeFirstInterval) {
      this.intervalConvert = this.firstIntervalMin * 60 + this.firstIntervalSec;
    } else if (this.landingPage.activeSecondInterval) {
      this.intervalConvert = this.firstIntervalMin * 60 + this.firstIntervalSec;
    }
  }

  preIntervalCalc() {
    if (this.landingPage.activeFirstPreInterval) {
      this.preIntervalConvert = this.intervalConvert - (this.firstPreIntervalMin * 60 + this.firstPreIntervalSec);
    } else if (this.landingPage.activeSecondPreInterval) {
      this.preIntervalConvert = this.intervalConvert - (this.secondPreIntervalMin * 60 + this.secondPreIntervalSec);
    }
  }

  playIntervalSound() {
    if (this.secAlert % this.intervalConvert === 0) {
      this.intervalSoundBehaviour(this.AUDIO_MAIN_ALERT);
    }
  }

  playPreIntervalSound() {
    if (this.secAlert % this.intervalConvert === this.preIntervalConvert) {
      this.intervalSoundBehaviour(this.AUDIO_PRE_ALERT);
    }
  }

  intervalSoundBehaviour(AUDIO_NAME: HTMLAudioElement) {
    if (AUDIO_NAME.paused) {
      AUDIO_NAME.play();
    }
    setTimeout(() => {
      AUDIO_NAME.pause();
      AUDIO_NAME.currentTime = 0;
    }, 900);
  }
}
