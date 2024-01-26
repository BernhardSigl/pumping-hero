import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { updateDoc } from '@angular/fire/firestore';
import { ShareTimeService } from '../../share-time/share-time.service';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';

interface Bodypart {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-rename-exercise',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './rename-exercise.component.html',
  styleUrl: './rename-exercise.component.scss'
})
export class RenameExerciseComponent {
  user!: User;
  userId!: string;
  exerciseName: { name: any } = { name: '' }; // create map
  bodypartName: string = '';
  entries: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shareTimeService: ShareTimeService,
    public dialogRef: MatDialogRef<RenameExerciseComponent>,
  ) { }

  ngOnInit(): void {

    this.userId = this.data.userId;
    const existingUser = this.data.userVariables[0];
    // console.log(existingUser);
    // console.log(this.data.bodypart);
    this.exerciseName.name = this.data.exerciseToEdit || '';
    this.bodypartName = this.data.bodypart || '';


    this.user = new User({
      // nicht verändert
      firstName: existingUser?.firstName,
      email: existingUser?.email,
      picture: existingUser?.picture,
      location: existingUser?.location,
      firstIntervalMin: existingUser?.firstIntervalMin,
      secondIntervalMin: existingUser?.secondIntervalMin,
      firstIntervalSec: existingUser?.firstIntervalSec,
      secondIntervalSec: existingUser?.secondIntervalSec,
      firstPreIntervalMin: existingUser?.firstPreIntervalMin,
      secondPreIntervalMin: existingUser?.secondPreIntervalMin,
      firstPreIntervalSec: existingUser?.firstPreIntervalSec,
      secondPreIntervalSec: existingUser?.secondPreIntervalSec,

      exercises: { ...existingUser?.exercises },
    });
  }

  async renameExercise() {
    const updatedExercise = {
      ...this.user.exercises[this.data.exerciseToEdit],
      bodypart: this.bodypartName
    };
    this.user.exercises[this.exerciseName.name] = updatedExercise;

    if (this.exerciseName.name !== this.data.exerciseToEdit) {
      delete this.user.exercises[this.data.exerciseToEdit];
    }

    let docRef = this.shareTimeService.getSingleUserDocRef(this.userId);
    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.dialogRef.close();
    });
  }

  bodyparts: Bodypart[] = [
    { value: 'Chest', viewValue: 'Chest' },
    { value: 'Back', viewValue: 'Back' },
    { value: 'Shoulders', viewValue: 'Shoulders' },
    { value: 'Arms', viewValue: 'Arms' },
    { value: 'Abdominal', viewValue: 'Abdominal' },
    { value: 'Legs', viewValue: 'Legs' },
    { value: 'Calves', viewValue: 'Calves' },
    { value: 'Stamina', viewValue: 'Stamina' },
    { value: 'Other', viewValue: 'Other' },
  ];
}
