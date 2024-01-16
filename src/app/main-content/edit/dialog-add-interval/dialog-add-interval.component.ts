import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, collection, doc, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../../../models/user.class';

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

}
