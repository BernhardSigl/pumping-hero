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
  selector: 'app-dialog-add-interval',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './dialog-add-interval.component.html',
  styleUrl: './dialog-add-interval.component.scss'
})
export class DialogAddIntervalComponent {
  firstIntervalMin!: number;
  secondIntervalMin!: number;
  firstIntervalSec!: number;
  secondIntervalSec!: number;
  user!: User;
  userId!: string;

  firestore: Firestore = inject(Firestore);

  // Mit @Inject(MAT_DIALOG_DATA) public data: any kann ich die Daten von der Landing Page beziehen
  // public dialogRef: MatDialogRef<DialogAddIntervalComponent>: schließt das popup fenster
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute, public dialogRef: MatDialogRef<DialogAddIntervalComponent>) { }

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
    this.userId = this.data.userId;

    this.user = new User({
      // nicht verändert
      firstName: existingUser?.firstName,
      email: existingUser?.email,
      picture: existingUser?.picture,
      location: existingUser?.location,
      firstPreIntervalMin: existingUser?.firstPreIntervalMin || 0,
      secondPreIntervalMin: existingUser?.secondPreIntervalMin || 0,
      firstPreIntervalSec: existingUser?.firstPreIntervalSec || 0,
      secondPreIntervalSec: existingUser?.secondPreIntervalSec || 0,

      // ändern
      firstIntervalMin: this.firstIntervalMin,
      secondIntervalMin: this.secondIntervalMin,
      firstIntervalSec: this.firstIntervalSec,
      secondIntervalSec: this.secondIntervalSec,
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

    // Aktualisiere this.user mit den neuen Werten
    this.user.firstIntervalMin = this.firstIntervalMin;
    this.user.secondIntervalMin = this.secondIntervalMin;
    this.user.firstIntervalSec = this.firstIntervalSec;
    this.user.secondIntervalSec = this.secondIntervalSec;

    // Speichere die aktualisierten Benutzerdaten
    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.dialogRef.close();
    });
  }

}
