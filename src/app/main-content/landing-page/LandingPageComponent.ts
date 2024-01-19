import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../models/user.class';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddExerciseComponent } from '../edit/dialog-add-exercise/dialog-add-exercise.component';
import { TimerComponent } from '../timer/timer.component';
import { ShareTimeService } from '../../share-time/share-time.service';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        FormsModule,
        TimerComponent,
    ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent {
    user!: User;
    userId!: string;
    userVariables: any[] = [];

    firestore: Firestore = inject(Firestore);

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public shareTimeService: ShareTimeService) {
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

    openAddExerciseCard() {
        this.dialog.open(DialogAddExerciseComponent, {
            data: { userId: this.userId, userVariables: this.userVariables },
        });
    }

    calculateValue(intervalMin: number, intervalSec: number): string | number {
        const timeToDec = ((intervalMin * 60) + intervalSec) / 60;

        if (isNaN(timeToDec)) {
            return "...";
        } else {
            return timeToDec.toFixed(1);
        }
    }

    // setInterval(interval: string) {
    //     this.toggleInterval(interval);
    //     this.togglePreInterval(interval);
    // }

    // toggleInterval(interval: string) {
    //     if (interval === 'firstInterval') {
    //         this.shareTimeService.activeFirstInterval = !this.shareTimeService.activeFirstInterval;
    //         this.shareTimeService.activeSecondInterval = false;
    //     } else if (interval === 'secondInterval') {
    //         this.shareTimeService.activeSecondInterval = !this.shareTimeService.activeSecondInterval;
    //         this.shareTimeService.activeFirstInterval = false;
    //     }
    //     if (!this.shareTimeService.activeFirstInterval && !this.shareTimeService.activeSecondInterval) {
    //         this.shareTimeService.activeFirstPreInterval = false;
    //         this.shareTimeService.activeSecondPreInterval = false;
    //     }
    // }

    // togglePreInterval(interval: string) {
    //     if (this.firstPreIntervalIsClicked(interval)) {
    //         this.shareTimeService.activeFirstPreInterval = !this.shareTimeService.activeFirstPreInterval;
    //         this.shareTimeService.activeSecondPreInterval = false;
    //     } else if (this.secondPreIntervalIsClicked(interval)) {
    //         this.shareTimeService.activeSecondPreInterval = !this.shareTimeService.activeSecondPreInterval;
    //         this.shareTimeService.activeFirstPreInterval = false;
    //     }
    //     this.intervalComparison();
    // }

    // firstPreIntervalIsClicked(interval: string) {
    //     return interval === 'firstPreInterval' && (this.shareTimeService.activeFirstInterval || this.shareTimeService.activeSecondInterval);
    // }

    // secondPreIntervalIsClicked(interval: string) {
    //     return interval === 'secondPreInterval' && (this.shareTimeService.activeFirstInterval || this.shareTimeService.activeSecondInterval);
    // }

    // intervalComparison() {
    //     const firstPreIntervalTime = this.shareTimeService.firstPreIntervalMin * 60 + this.shareTimeService.firstPreIntervalSec;
    //     const secondPreIntervalTime = this.shareTimeService.secondPreIntervalMin * 60 + this.shareTimeService.secondPreIntervalSec;

    //     this.inervalComparisonCalc(firstPreIntervalTime, this.shareTimeService.activeFirstPreInterval);
    //     this.inervalComparisonCalc(secondPreIntervalTime, this.shareTimeService.activeSecondPreInterval);
    // }

    // inervalComparisonCalc(preIntervalTime: number, activePreInterval: Boolean) {
    //     if (this.firstIntervalSmallerThanPreInterval(preIntervalTime, activePreInterval)) {
    //         console.log('first pre interval must be smaller than selected interval');
    //         this.disablePreIntervalBtns();
    //     } else if (this.secondIntervalSmallerThanPreInterval(preIntervalTime, activePreInterval)) {
    //         console.log('first pre interval must be smaller than selected interval');
    //         this.disablePreIntervalBtns();
    //     }
    // }

    // firstIntervalSmallerThanPreInterval(preIntervalTime: number, activePreInterval: Boolean) {
    //     const firstIntervalTime = this.shareTimeService.firstIntervalMin * 60 + this.shareTimeService.firstIntervalSec;
    //     return this.shareTimeService.activeFirstInterval && activePreInterval && firstIntervalTime < preIntervalTime;
    // }

    // secondIntervalSmallerThanPreInterval(preIntervalTime: number, activePreInterval: Boolean) {
    //     const secondIntervalTime = this.shareTimeService.secondIntervalMin * 60 + this.shareTimeService.secondIntervalSec;
    //     return this.shareTimeService.activeSecondInterval && activePreInterval && secondIntervalTime < preIntervalTime
    // }

    // disablePreIntervalBtns() {
    //     this.shareTimeService.activeFirstPreInterval = false;
    //     this.shareTimeService.activeSecondPreInterval = false;
    // }
}
