import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ShareTimeService } from '../../share-time/share-time.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  firstIntervalMin!: number;
  secondIntervalMin!: number;
  firstIntervalSec!: number;
  secondIntervalSec!: number;

  firstPreIntervalMin!: number;
  secondPreIntervalMin!: number;
  firstPreIntervalSec!: number;
  secondPreIntervalSec!: number;

  user!: User;
  userId!: string;

  // Mit @Inject(MAT_DIALOG_DATA) public data: any kann ich die Daten von der Timer Page beziehen. (Timer bezieht Daten von share-timer.service)
  // public dialogRef: MatDialogRef<EditComponent>: schließt das popup fenster
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditComponent>,
    private shareTimeService: ShareTimeService,
  ) { }

  ngOnInit(): void {
    const existingUser = this.data.userVariables[0];
    this.userId = this.data.userId;
    // fill inputs in html
    this.firstIntervalMin = existingUser?.firstIntervalMin || 0;
    this.secondIntervalMin = existingUser?.secondIntervalMin || 0;
    this.firstIntervalSec = existingUser?.firstIntervalSec || 0;
    this.secondIntervalSec = existingUser?.secondIntervalSec || 0;

    this.firstPreIntervalMin = existingUser?.firstPreIntervalMin || 0;
    this.secondPreIntervalMin = existingUser?.secondPreIntervalMin || 0;
    this.firstPreIntervalSec = existingUser?.firstPreIntervalSec || 0;
    this.secondPreIntervalSec = existingUser?.secondPreIntervalSec || 0;

    this.user = new User({
      // nicht verändert
      firstName: existingUser?.firstName,
      email: existingUser?.email,
      picture: existingUser?.picture,
      location: existingUser?.location,
      exercises: { ...existingUser?.exercises },

      // ändern
      firstIntervalMin: this.firstIntervalMin,
      secondIntervalMin: this.secondIntervalMin,
      firstIntervalSec: this.firstIntervalSec,
      secondIntervalSec: this.secondIntervalSec,

      firstPreIntervalMin: this.firstPreIntervalMin,
      secondPreIntervalMin: this.secondPreIntervalMin,
      firstPreIntervalSec: this.firstPreIntervalSec,
      secondPreIntervalSec: this.secondPreIntervalSec,
    });
  }

  async saveUser() {
    let docRef = this.shareTimeService.getSingleUserDocRef(this.userId);

    this.user.firstIntervalMin = this.firstIntervalMin;
    this.user.secondIntervalMin = this.secondIntervalMin;
    this.user.firstIntervalSec = this.firstIntervalSec;
    this.user.secondIntervalSec = this.secondIntervalSec;

    this.user.firstPreIntervalMin = this.firstPreIntervalMin;
    this.user.secondPreIntervalMin = this.secondPreIntervalMin;
    this.user.firstPreIntervalSec = this.firstPreIntervalSec;
    this.user.secondPreIntervalSec = this.secondPreIntervalSec;

    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.dialogRef.close();
    });
    this.shareTimeService.intervalComparison();
  }

  saveBehaviour(): boolean {
    return this.isValidInterval(this.firstIntervalMin, this.firstIntervalSec)
      && this.isValidInterval(this.secondIntervalMin, this.secondIntervalSec)
      && this.isValidInterval(this.firstPreIntervalMin, this.firstPreIntervalSec)
      && this.isValidInterval(this.secondPreIntervalMin, this.secondPreIntervalSec);
  }

  isValidInterval(min: number, sec: number): boolean {
    return min >= 0 && min <= 59 && sec >= 0 && sec <= 59;
  }
}
