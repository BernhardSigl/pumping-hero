import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../edit/edit.component';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { User } from '../../models/user.class';

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

  user!: User;
  userId!: string;
  userVariables: any[] = [];

  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  startTimer: any;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog, public shareTimeService: ShareTimeService) {
    // btn booleans
    this.shareTimeService.activeFirstInterval;
    this.shareTimeService.activeSecondInterval;
    this.shareTimeService.activeFirstPreInterval;
    this.shareTimeService.activeSecondPreInterval;
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

      this.shareTimeService.firstIntervalMin = userVariable.firstIntervalMin;
      this.shareTimeService.secondIntervalMin = userVariable.secondIntervalMin;
      this.shareTimeService.firstPreIntervalMin = userVariable.firstPreIntervalMin;
      this.shareTimeService.secondPreIntervalMin = userVariable.secondPreIntervalMin;

      this.shareTimeService.firstIntervalSec = userVariable.firstIntervalSec;
      this.shareTimeService.secondIntervalSec = userVariable.secondIntervalSec;
      this.shareTimeService.firstPreIntervalSec = userVariable.firstPreIntervalSec;
      this.shareTimeService.secondPreIntervalSec = userVariable.secondPreIntervalSec;
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
}
