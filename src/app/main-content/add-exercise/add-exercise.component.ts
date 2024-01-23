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
  selector: 'app-add-exercise',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './add-exercise.component.html',
  styleUrl: './add-exercise.component.scss'
})
export class AddExerciseComponent {
  user!: User;
  userId!: string;
  exerciseName: { name: any } = { name: '' }; // create map
  bodypartName: string = '';
  entries: any[] = [];
  // entries: { name: any } = { name: '' }; // create map

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddExerciseComponent>,
    private shareTimeService: ShareTimeService,
  ) { }

  ngOnInit(): void {

    // console.log(existingUser.exercises);
    this.userId = this.data.userId;
    const existingUser = this.data.userVariables[0];

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

  async saveAddExercise() {
    this.user.exercises[this.exerciseName.name] = {};
    this.user.exercises[this.exerciseName.name].bodypart = this.bodypartName;
    this.user.exercises[this.exerciseName.name].entries = this.entries;

    // this.user.exercises[this.entries.name] = {};
    // this.user.exercises[this.entries.name].reps = this.reps;

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