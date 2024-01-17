import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from '../edit/edit.component';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { User } from '../../models/user.class';

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

  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;

  startTimer: any;
  running = false;

  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    this.subUsers();
  }

  async subUsers() {
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

  start(): void {
    if (!this.running) {
      this.running = true;
      this.startTimer = setInterval(() => {
        this.ms++;
        this.ms = this.ms < 10 ? '0' + this.ms : this.ms;

        if (this.ms === 100) {
          this.sec++;
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
    this.running = false;
  }

  reset(): void {
    clearInterval(this.startTimer);
    this.running = false;
    this.hr = this.min = this.sec = this.ms = '0' + 0;
  }

  openEditIntervalCard() {
    this.dialog.open(EditComponent, {
      data: { userId: this.userId, userVariables: this.userVariables },
    });
  }
}
