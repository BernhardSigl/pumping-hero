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
  firstInterval!: number;
  secondInterval!: number;
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
    this.firstInterval = existingUser?.firstInterval || 0;
    this.secondInterval = existingUser?.secondInterval || 0;
    this.userId = this.data.userId;

    this.user = new User({
      firstName: existingUser?.firstName,
      email: existingUser?.email,
      picture: existingUser?.picture,
      location: existingUser?.location,
      firstInterval: this.firstInterval,
      secondInterval: this.secondInterval,
      firstPreInterval: existingUser?.firstPreInterval || 0,
      secondPreInterval: existingUser?.secondPreInterval || 0,
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
    this.user.firstInterval = this.firstInterval;
    this.user.secondInterval = this.secondInterval;

    // Speichere die aktualisierten Benutzerdaten
    await updateDoc(docRef, this.user.toJson()).then(() => {
      this.dialogRef.close();
    });
  }

}
