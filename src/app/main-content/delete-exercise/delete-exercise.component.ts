import { Component, Inject } from '@angular/core';
import { ShareTimeService } from '../../share-time/share-time.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.class';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-delete-exercise',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './delete-exercise.component.html',
  styleUrl: './delete-exercise.component.scss'
})
export class DeleteExerciseComponent {
  user!: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shareTimeService: ShareTimeService,
    public dialogRef: MatDialogRef<DeleteExerciseComponent>,
  ) {
  }

  ngOnInit(): void {
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

  async deleteExercise() {
    const exerciseName = this.data.exerciseToDelete;
    delete this.user.exercises[exerciseName];

    let docRef = this.shareTimeService.getSingleUserDocRef(this.data.userId);
    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.shareTimeService.landingPageSubUsers(this.data.userId);
      this.dialogRef.close();
    });
  }

}
