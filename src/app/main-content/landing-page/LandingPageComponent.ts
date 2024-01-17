import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TimerComponent } from '../timer/timer.component';
import { User } from '../../models/user.class';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddExerciseComponent } from '../edit/dialog-add-exercise/dialog-add-exercise.component';
import { DialogAddIntervalComponent } from '../edit/dialog-add-interval/dialog-add-interval.component';
import { DialogAddPreIntervalComponent } from '../edit/dialog-add-pre-interval/dialog-add-pre-interval.component';
import { EditComponent } from '../edit/edit.component';


@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
        CommonModule,
        TimerComponent,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        FormsModule
    ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
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

    activeFirstInterval = false;
    activeSecondInterval = false;
    activeFirstPreInterval = false;
    activeSecondPreInterval = false;

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

    setInterval(interval: string) {
        this.toggleInterval(interval);
        this.togglePreInterval(interval);
    }

    toggleInterval(interval: string) {
        if (interval === 'firstInterval') {
            this.activeFirstInterval = !this.activeFirstInterval;
            this.activeSecondInterval = false;
        } else if (interval === 'secondInterval') {
            this.activeSecondInterval = !this.activeSecondInterval;
            this.activeFirstInterval = false;
        }
        if (!this.activeFirstInterval && !this.activeSecondInterval) {
            this.activeFirstPreInterval = false;
            this.activeSecondPreInterval = false;
        }
    }

    togglePreInterval(interval: string) {
        if (interval === 'firstPreInterval' && (this.activeFirstInterval || this.activeSecondInterval)) {
            this.activeFirstPreInterval = !this.activeFirstPreInterval;
            this.activeSecondPreInterval = false;
        } else if (interval === 'secondPreInterval' && (this.activeFirstInterval || this.activeSecondInterval)) {
            this.activeSecondPreInterval = !this.activeSecondPreInterval;
            this.activeFirstPreInterval = false;
        }
    }
}
