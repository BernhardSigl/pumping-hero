import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

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

  firestore: Firestore = inject(Firestore);

  // Mit @Inject(MAT_DIALOG_DATA) public data: any kann ich die Daten von der Landing Page beziehen
  // public dialogRef: MatDialogRef<DialogAddIntervalComponent>: schließt das popup fenster
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute, public dialogRef: MatDialogRef<EditComponent>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    const existingUser = this.data.userVariables[0];
    // fill inputs in html
    this.firstIntervalMin = existingUser?.firstIntervalMin || 0;
    this.secondIntervalMin = existingUser?.secondIntervalMin || 0;
    this.firstIntervalSec = existingUser?.firstIntervalSec || 0;
    this.secondIntervalSec = existingUser?.secondIntervalSec || 0;

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

  getUsersColRef() {
    return collection(this.firestore, "users");
  }

  getSingleUserDocRef(docId: string) {
    return doc(this.getUsersColRef(), docId);
  }

  async saveUser() {
    let docRef = this.getSingleUserDocRef(this.userId);

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
  }
}
