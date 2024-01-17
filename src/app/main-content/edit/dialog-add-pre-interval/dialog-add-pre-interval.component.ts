import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dialog-add-pre-interval',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './dialog-add-pre-interval.component.html',
  styleUrl: './dialog-add-pre-interval.component.scss'
})
export class DialogAddPreIntervalComponent {
  firstPreIntervalMin!: number;
  secondPreIntervalMin!: number;
  firstPreIntervalSec!: number;
  secondPreIntervalSec!: number;
  user!: User;
  userId!: string;

  firestore: Firestore = inject(Firestore);

  // Mit @Inject(MAT_DIALOG_DATA) public data: any kann ich die Daten von der Landing Page beziehen
  // public dialogRef: MatDialogRef<DialogAddIntervalComponent>: schließt das popup fenster
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute, public dialogRef: MatDialogRef<DialogAddPreIntervalComponent>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    const existingUser = this.data.userVariables[0];
    // fill inputs in html
    this.firstPreIntervalMin = existingUser?.firstPreIntervalMin || 0;
    this.secondPreIntervalMin = existingUser?.secondPreIntervalMin || 0;
    this.firstPreIntervalSec = existingUser?.firstPreIntervalSec || 0;
    this.secondPreIntervalSec = existingUser?.secondPreIntervalSec || 0;
    this.userId = this.data.userId;

    this.user = new User({
      // nicht verändert
      firstName: existingUser?.firstName,
      email: existingUser?.email,
      picture: existingUser?.picture,
      location: existingUser?.location,
      firstIntervalMin: existingUser?.firstIntervalMin || 0,
      secondIntervalMin: existingUser?.secondIntervalMin || 0,
      firstIntervalSec: existingUser?.firstIntervalSec || 0,
      secondIntervalSec: existingUser?.secondIntervalSec || 0,

      // ändern
      firstPreIntervalMin: this.firstPreIntervalMin,
      secondPreIntervalMin: this.secondPreIntervalMin,
      firstPreIntervalSec: this.firstPreIntervalSec,
      secondPreIntervalSec: this.secondPreIntervalSec,
    });
  }

  getUsersColRef() {
    return collection(this.firestore, "users");
  }

  getSingleUserDocRef(docId: string) {
    return doc(this.getUsersColRef(), docId);
  }

  async saveUser() {
    let docRef = this.getSingleUserDocRef(this.userId);

    this.user.firstPreIntervalMin = this.firstPreIntervalMin;
    this.user.secondPreIntervalMin = this.secondPreIntervalMin;
    this.user.firstPreIntervalSec = this.firstPreIntervalSec;
    this.user.secondPreIntervalSec = this.secondPreIntervalSec;

    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.dialogRef.close();
    });
  }
}
