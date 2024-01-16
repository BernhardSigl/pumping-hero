import { Component, inject } from '@angular/core';
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


@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
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

    firstInterval!: number;
    secondInterval!: number;
    firstPreInterval!: number;
    secondPreInterval!: number;

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
            this.userVariables.push(userField);
            const userVariable = this.userVariables[0];
            this.firstInterval = userVariable.firstInterval;
            this.secondInterval = userVariable.secondInterval;
            this.firstPreInterval = userVariable.firstPreInterval;
            this.secondPreInterval = userVariable.secondPreInterval;
        });
    }

    getUsersColRef() {
        return collection(this.firestore, "users");
    }

    getSingleUserDocRef(docId: string) {
        return doc(this.getUsersColRef(), docId);
    }


    openAddExerciseCard() {
        const dialog = this.dialog.open(DialogAddExerciseComponent);
    }

    openAddIntervalCard() {
        const dialog = this.dialog.open(DialogAddIntervalComponent);
    }

    openAddPreIntervalCard() {
        const dialog = this.dialog.open(DialogAddPreIntervalComponent);
    }
}
