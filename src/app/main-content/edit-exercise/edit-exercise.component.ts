import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// date
import { FormControl, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { ShareTimeService } from '../../share-time/share-time.service';
import { LandingPageComponent } from '../landing-page/LandingPageComponent';
import { updateDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { DeleteDiaryEntryComponent } from '../delete-diary-entry/delete-diary-entry.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatNativeDateModule,
  ]
})

export class EditExerciseComponent {
  user!: User;
  // userId!: string;
  convertedDate!: any;

  diaryEntries: any[] = [];

  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  // input: any;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    public shareTimeService: ShareTimeService,
    public landingPage: LandingPageComponent,
    public dialog: MatDialog,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.shareTimeService.subUsers(this.landingPage.userId);
    this.user = { ...this.shareTimeService.userVariables[0] };
    this.diaryEntries = this.user?.exercises[this.shareTimeService.currentDiaryEntry]?.entries || [];

    this.convertDate();

    const existingUser = this.shareTimeService.userVariables[0];
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

    this.emptyDiaryEntry();
  }

  // convert firebase date to html date
  convertDate() {
    for (const dateEntry of this.diaryEntries) {
      const unconvertedDates = dateEntry?.date;
      if (unconvertedDates) {
        const timestamp = { seconds: dateEntry.date['seconds'] };
        dateEntry.date = new Date(timestamp.seconds * 1000);
      }
    }
  }

  emptyDiaryEntry() {
    if (this.diaryEntries.length === 0) {
      const newEntry = {
        date: new Date,
        info: '',
        repValues: ['', '', '', '', ''],
      };
      this.diaryEntries.unshift(newEntry);
      this.save();
    }
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
    const currentExercise = this.shareTimeService.userVariables[0].exercises[this.shareTimeService.currentDiaryEntry]['entries'];

    const newEntry = {
      date: new Date(),
      info: '',
      repValues: ['', '', '', '', ''],
    };

    this.diaryEntries.unshift(newEntry); // anzeige im html
    currentExercise.push(newEntry); // in firebase eintragen
    this.save();
  }

  async save() {
    let docRef = this.shareTimeService.getSingleUserDocRef(this.landingPage.userId);
    await updateDoc(docRef, this.user.toJson());
  }

  increaseValue(entryIndex: number, repIndex: number) {
    this.diaryEntries[entryIndex].repValues[repIndex]++;
    this.save();
  }

  decreaseValue(entryIndex: number, repIndex: number) {
    if (this.diaryEntries[entryIndex].repValues[repIndex] > 0) {
      this.diaryEntries[entryIndex].repValues[repIndex]--;
      this.save();
    }
  }

  openDeleteDiaryEntry(entryIndex: number) {
    this.dialog.open(DeleteDiaryEntryComponent, {
      data: {
        entryIndex: entryIndex,
        currentDiaryEntry: this.shareTimeService.currentDiaryEntry,
        diaryEntries: this.diaryEntries,
        save: () => this.save()
      },
    });
  }
}
