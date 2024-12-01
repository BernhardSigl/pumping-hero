import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimerComponent } from '../timer/timer.component';
import { ShareTimeService } from '../../share-time/share-time.service';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { updateDoc } from '@angular/fire/firestore';
import { EditExerciseComponent } from '../edit-exercise/edit-exercise.component';
import { User } from '../../models/user.class';
import { DeleteExerciseComponent } from '../delete-exercise/delete-exercise.component';
import { RenameExerciseComponent } from '../rename-exercise/rename-exercise.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    FormsModule,
    TimerComponent,
    EditExerciseComponent,
  ],
})
export class LandingPageComponent {
  userId!: string;
  user!: User;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public shareTimeService: ShareTimeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.shareTimeService.logDocId(this.userId);
    await this.shareTimeService.subUsers(this.userId);
    await this.shareTimeService.landingPageSubUsers(this.userId);
    this.shareTimeService.checkIntervalsOnStart();
    this.shareTimeService.keepScreenAwake();
  }

  openAddExerciseCard() {
    this.shareTimeService.showEditDiary = false;
    this.dialog.open(AddExerciseComponent, {
      data: {
        userId: this.userId,
        userVariables: this.shareTimeService.userVariables,
      },
      position: { top: '90px' },
      width: '90%',
    });
  }

  openEditExercise(exercise: string, i: number) {
    this.shareTimeService.show = false;
    this.shareTimeService.showEditDiary = false;
    this.shareTimeService.currentDiaryEntryLog(exercise);
  }

  removeDiaryEntry(event: Event, exercise: any) {
    event.stopPropagation();
    this.dialog.open(DeleteExerciseComponent, {
      data: {
        userId: this.userId,
        exerciseToDelete: exercise,
        userVariables: this.shareTimeService.userVariables,
      },
      position: { top: '90px' },
    });
  }

  editDiaryEntry(event: Event, exercise: any) {
    event.stopPropagation();
    this.dialog.open(RenameExerciseComponent, {
      data: {
        userId: this.userId,
        exerciseToEdit: exercise,
        userVariables: this.shareTimeService.userVariables,
        bodypart:
          this.shareTimeService.userVariables[0].exercises[exercise][
            'bodypart'
          ],
      },
      position: { top: '90px' },
      width: '90%',
    });
  }

  async save() {
    let docRef = this.shareTimeService.getSingleUserDocRef(this.userId);
    await updateDoc(docRef, this.user.toJson());
  }

  showEditRemoveDiary() {
    this.shareTimeService.showEditDiary = true;
  }

  backup(): void {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    const exercises = this.shareTimeService.userVariables[0].exercises;
    let exercisesText = '';
    for (const exercise in exercises) {
      if (exercises.hasOwnProperty(exercise)) {
        exercisesText += exercise + '\n';
        const exerciseProps = exercises[exercise];
        for (const prop in exerciseProps) {
          if (exerciseProps.hasOwnProperty(prop)) {
            if (Array.isArray(exerciseProps[prop])) {
              exerciseProps[prop].forEach(
                (entry: any, index: number, arr: any[]) => {
                  if (index !== 0) {
                    exercisesText += '----------\n';
                  }
                  exercisesText += 'Entry ' + (index + 1) + ':\n';
                  for (const entryProp in entry) {
                    if (entry.hasOwnProperty(entryProp)) {
                      if (entryProp === 'date') {
                        exercisesText +=
                          entryProp +
                          ': ' +
                          this.formatDate(entry[entryProp]) +
                          '\n';
                      } else {
                        exercisesText +=
                          entryProp + ': ' + entry[entryProp] + '\n';
                      }
                    }
                  }
                }
              );
            } else {
              exercisesText += prop + ': ' + exerciseProps[prop] + '\n';
            }
          }
        }
        exercisesText += '\n';
      }
    }
    const blob = new Blob([exercisesText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formattedDate}_pumpinghero_backup.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  formatDate(timestamp: { seconds: number; nanoseconds: number }): string {
    const seconds = timestamp.seconds;
    const date = new Date(seconds * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  hideTime() {
    const showHideContent = document.getElementsByClassName("showHideContent");
    const diaryContent = document.getElementById("gym-diary");
    const showHideTimeBtn = document.getElementById("showHideTime");
    const margin = document.getElementById("gym-diary-title");

    if (showHideTimeBtn) {
      const iconElement = showHideTimeBtn.querySelector("mat-icon");
  
      if (showHideTimeBtn.classList.contains("toggled")) {
        Array.from(showHideContent).forEach((c) => {
          (c as HTMLElement).classList.remove("hideTimeContent");
        });
  
        if (diaryContent) {
          diaryContent.style.height = "calc(100vh - 490px)";
        }
  
        if (iconElement) {
          iconElement.innerHTML = "keyboard_arrow_up";
        }

        if (margin) {
          margin.style.marginTop = "16px";
        }

        showHideTimeBtn.classList.remove("toggled");
      } else {
        Array.from(showHideContent).forEach((c) => {
          (c as HTMLElement).classList.add("hideTimeContent");
        });
  
        if (diaryContent) {
          diaryContent.style.height = "calc(100vh - 313px)";
        }
  
        if (iconElement) {
          iconElement.innerHTML = "keyboard_arrow_down";
        }

        if (margin) {
          margin.style.marginTop = "0";
        }
  
        showHideTimeBtn.classList.add("toggled");
      }
    }
  }
  
  
}
