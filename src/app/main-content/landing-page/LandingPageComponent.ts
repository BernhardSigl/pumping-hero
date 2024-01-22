import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimerComponent } from '../timer/timer.component';
import { ShareTimeService } from '../../share-time/share-time.service';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { onSnapshot } from '@angular/fire/firestore';
import { EditExerciseComponent } from "../edit-exercise/edit-exercise.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        FormsModule,
        TimerComponent,
        EditExerciseComponent
    ]
})

export class LandingPageComponent {
    userId!: string;
    exercisesList: any[] = [];

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public shareTimeService: ShareTimeService,
    ) { }

    // get the exercise list
    subUsers() {
        const q = this.shareTimeService.getSingleUserDocRef(this.userId);
        onSnapshot(q, (querySnapshot) => {
            let userField = querySnapshot.data();
            const exercises = userField!['exercises'];
            // map to array
            this.exercisesList = exercises ? Object.keys(exercises) : [];
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

    openEditExercise(exercise: string) {
        this.shareTimeService.currentDiaryEntryLog(exercise);
        this.shareTimeService.show = false;
    }

    removeDiaryEntry(event: Event, exercise: string) {
        event.stopPropagation();
        console.log('delete: ', exercise);
    }

    showEditRemoveDiary() {
        this.shareTimeService.showEditDiary = true;
    }
}
