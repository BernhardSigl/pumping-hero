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
import { onSnapshot, updateDoc } from '@angular/fire/firestore';
import { EditExerciseComponent } from "../edit-exercise/edit-exercise.component";
import { User } from '../../models/user.class';
import { DeleteExerciseComponent } from '../delete-exercise/delete-exercise.component';
import { RenameExerciseComponent } from '../rename-exercise/rename-exercise.component';

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
    user!: User;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public shareTimeService: ShareTimeService,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.userId = params['id'];
        });
        this.shareTimeService.subUsers(this.userId);
        this.shareTimeService.landingPageSubUsers(this.userId);
    }

    openAddExerciseCard() {
        this.shareTimeService.showEditDiary = false;
        this.dialog.open(AddExerciseComponent, {
            data: {
                userId: this.userId,
                userVariables: this.shareTimeService.userVariables
            },
            position: { top: '90px' },
            width: '90%'
        });
    }

    openEditExercise(exercise: string, i: number) {
        this.shareTimeService.show = false;
        this.shareTimeService.showEditDiary = false;
        this.shareTimeService.currentDiaryEntryLog(exercise);
    }

    removeDiaryEntry(event: Event, exercise: any) {
        event.stopPropagation();
        this.dialog.open(DeleteExerciseComponent, {
            data: {
                userId: this.userId,
                exerciseToDelete: exercise,
                userVariables: this.shareTimeService.userVariables
            },
            position: { top: '90px' }
        });
    }

    editDiaryEntry(event: Event, exercise: any) {
        event.stopPropagation();
        this.dialog.open(RenameExerciseComponent, {
            data: {
                userId: this.userId,
                exerciseToEdit: exercise,
                userVariables: this.shareTimeService.userVariables,
                bodypart: this.shareTimeService.userVariables[0].exercises[exercise]['bodypart']
            },
            position: { top: '90px' },
            width: '90%'
        });
    }

    async save() {
        let docRef = this.shareTimeService.getSingleUserDocRef(this.userId);
        await updateDoc(docRef, this.user.toJson());
    }

    showEditRemoveDiary() {
        this.shareTimeService.showEditDiary = true;
    }
}
