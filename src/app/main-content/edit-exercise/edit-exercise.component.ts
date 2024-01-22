import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// date
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { ShareTimeService } from '../../share-time/share-time.service';
import { onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LandingPageComponent } from '../landing-page/LandingPageComponent';

@Component({
  selector: 'app-edit-exercise',
  standalone: true,
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ]
})

export class EditExerciseComponent {
  userId!: string;
  exercisesList: any[] = [];
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  constructor(
    private dateAdapter: DateAdapter<Date>,
    public shareTimeService: ShareTimeService,
    private route: ActivatedRoute,
    public landingPage: LandingPageComponent,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  back() {
    this.shareTimeService.show = true;
    this.shareTimeService.currentDiaryEntry = '';
  }

  addDiaryEntry() {

  }
}
