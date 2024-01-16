import { Component, inject } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    TimerComponent,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,

    FormsModule,
    MatInputModule,
    MatFormFieldModule,

    MatCardModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

}
