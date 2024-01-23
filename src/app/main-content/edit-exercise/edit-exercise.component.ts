import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
import { LandingPageComponent } from '../landing-page/LandingPageComponent';
import { updateDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-edit-exercise',
  standalone: true,
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.scss',
  imports: [
    CommonModule,
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
  user!: User;
  userId!: string;

  diaryEntries: any[] = [];
  repValues: number[] = [0, 0, 0, 0, 0];
  info!: any;

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());

  constructor(
    private dateAdapter: DateAdapter<Date>,
    public shareTimeService: ShareTimeService,
    public landingPage: LandingPageComponent,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.shareTimeService.subUsers(this.landingPage.userId);

    this.user = { ...this.shareTimeService.userVariables[0] };

    this.diaryEntries = this.user?.exercises[this.shareTimeService.currentDiaryEntry]?.entries || [];

    const existingUser = this.shareTimeService.userVariables[0];

    // if (this.shareTimeService.userVariables[0].exercises[this.shareTimeService.currentDiaryEntry]?.entries[0]?.date) {
    let currentExercise = this.shareTimeService.userVariables[0].exercises[this.shareTimeService.currentDiaryEntry]['entries'][0].date;
    const currentDate = this.timestampToDate(currentExercise);
    this.user.exercises[this.shareTimeService.currentDiaryEntry].entries[0].date = currentDate;
    console.log(this.diaryEntries);
    // }

    this.user = new User({
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
      exercises: existingUser?.exercises,
    });

    console.log(this.user.exercises[this.shareTimeService.currentDiaryEntry].entries[0].date);

  }

  timestampToDate(timestamp: any): string {
    const seconds = timestamp.seconds;
    const date = new Date(seconds * 1000);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  back() {
    this.shareTimeService.show = true;
    this.shareTimeService.currentDiaryEntry = '';
  }

  addDiaryEntry() {
    const existingUser = this.shareTimeService.userVariables[0];

    const currentExercise = this.shareTimeService.userVariables[0].exercises[this.shareTimeService.currentDiaryEntry]['entries'];


    const newEntry = {
      date: '',
      info: '',
      repValues: [0, 0, 0, 0, 0],
    };

    this.diaryEntries.unshift(newEntry);
    currentExercise.push(newEntry);
  }

  async save() {
    console.log('saved!');

    let docRef = this.shareTimeService.getSingleUserDocRef(this.landingPage.userId);

    await updateDoc(docRef, this.user.toJson()).then(() => {

    });
  }
}
