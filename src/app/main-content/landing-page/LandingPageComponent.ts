import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimerComponent } from '../timer/timer.component';
import { ShareTimeService } from '../../share-time/share-time.service';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { onSnapshot } from '@angular/fire/firestore';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

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
        TimerComponent
    ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})

export class LandingPageComponent {
    userId!: string;
    exercisesList: any[] = [];

    durationInSeconds = 5;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public shareTimeService: ShareTimeService,
        private _snackBar: MatSnackBar,
    ) { }

    // get the exercise list
    subUsers() {
        const q = this.shareTimeService.getSingleUserDocRef(this.userId);
        onSnapshot(q, (querySnapshot) => {
            let userField = querySnapshot.data();
            const exercises = userField!['exercises'];
            // map to array
            this.exercisesList = exercises ? Object.keys(exercises) : [];
            console.log(this.exercisesList);
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.userId = params['id'];
        });
        this.shareTimeService.subUsers(this.userId);
        this.subUsers();
    }

    openAddExerciseCard() {
        this.dialog.open(AddExerciseComponent, {
            data: { userId: this.userId, userVariables: this.shareTimeService.userVariables },
        });
    }
}
