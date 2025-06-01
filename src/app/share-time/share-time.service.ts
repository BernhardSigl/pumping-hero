import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../main-content/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class ShareTimeService {
  value = 0;
  secAlert: number = 0;
  running = false;
  userVariables: any[] = [];
  show: boolean = true;
  showEditDiary: boolean = false;
  currentDiaryEntry!: string;
  docId!: string;

  exercisesList: string[] = [];

  preIntervalConvert!: any;
  startTimerAlert: any;
  intervalConvert!: any;

  firstIntervalMin!: number;
  secondIntervalMin!: number;
  firstPreIntervalMin!: number;
  secondPreIntervalMin!: number;

  firstIntervalSec!: number;
  secondIntervalSec!: number;
  firstPreIntervalSec!: number;
  secondPreIntervalSec!: number;

  activeFirstInterval = false;
  activeSecondInterval = false;
  activeFirstPreInterval = false;
  activeSecondPreInterval = false;

  AUDIO_MAIN_ALERT = new Audio('./../../assets/sounds/main-alert.mp3');
  AUDIO_PRE_ALERT = new Audio('./../../assets/sounds/pre-alert.mp3');

  backgroundImages: { [key: string]: string } = {};

  sortBodypart: string[] = [];

  firestore: Firestore = inject(Firestore);

  userId!: string;
  lastSavedExercise!: string;

  hideShowIntervalBool!: boolean;

  constructor(private _snackBar: MatSnackBar) {}

  currentDiaryEntryLog(exercise: string) {
    this.currentDiaryEntry = exercise;
  }

  // Firebase
  async subUsers(userId: string): Promise<void> {
    this.userId = userId;
    return new Promise<void>((resolve, reject) => {
      const q = this.getSingleUserDocRef(userId);
      onSnapshot(q, (querySnapshot) => {
        let userField = querySnapshot.data();

        this.userVariables.pop(); // aktuallisiert potenzielle Änderungen
        this.userVariables.push(userField);

        const userVariable = this.userVariables[0];

        this.firstIntervalMin = userVariable.firstIntervalMin;
        this.secondIntervalMin = userVariable.secondIntervalMin;
        this.firstPreIntervalMin = userVariable.firstPreIntervalMin;
        this.secondPreIntervalMin = userVariable.secondPreIntervalMin;

        this.firstIntervalSec = userVariable.firstIntervalSec;
        this.secondIntervalSec = userVariable.secondIntervalSec;
        this.firstPreIntervalSec = userVariable.firstPreIntervalSec;
        this.secondPreIntervalSec = userVariable.secondPreIntervalSec;
        resolve();
      });
    });
  }

  // get the exercise list
  async landingPageSubUsers(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const q = this.getSingleUserDocRef(userId);
      onSnapshot(q, (querySnapshot) => {
        let userField = querySnapshot.data();
        const exercises = userField!['exercises'];
        // map to array
        this.exercisesList = exercises ? Object.keys(exercises) : [];

        // background image
        this.sortBodypart = [];
        this.exercisesList.forEach((exerciseName: string) => {
          this.checkBodypart(exerciseName);
          // this.sortBodypart = [];
          this.sortBodypart.push(
            this.userVariables[0].exercises[`${exerciseName}`]['bodypart']
          );
        });
        this.sortDiary();
        resolve();
      });
    });
  }

  async deleteFieldElement(docId: string, exercise?: any) {
    const docRef = doc(this.firestore, 'users', docId);

    await updateDoc(docRef, {
      capital: deleteField(),
    });
  }

  getUsersColRef() {
    return collection(this.firestore, 'users');
  }

  getSingleUserDocRef(docId: string) {
    return doc(this.getUsersColRef(), docId);
  }

  // Timer
  logCurrentTime() {
    if (this.checkActiveInterval()) {
      this.startTimerAlert = setInterval(() => {
        this.intervalCalc();
        this.preIntervalCalc();
        this.playIntervalSound();
        this.playPreIntervalSound();
      }, 10);
    }
  }

  checkActiveInterval() {
    return (
      (this.activeFirstInterval || this.activeSecondInterval) && this.running
    );
  }

  intervalCalc() {
    if (this.activeFirstInterval) {
      this.intervalConvert = this.firstIntervalMin * 60 + this.firstIntervalSec;
      this.circleProgressBehaviour();
    } else if (this.activeSecondInterval) {
      this.intervalConvert =
        this.secondIntervalMin * 60 + this.secondIntervalSec;
      this.circleProgressBehaviour();
    } else {
      this.value = 0;
    }
  }

  circleProgressBehaviour() {
    this.value = this.secAlert * (100 / this.intervalConvert);
    if (this.value == 100) {
      this.secAlert = 0;
    }
    if (this.value > 100) {
      this.value = +('' + (this.value % 100));
    }
  }

  preIntervalCalc() {
    if (this.activeFirstPreInterval) {
      this.preIntervalConvert =
        this.intervalConvert -
        (this.firstPreIntervalMin * 60 + this.firstPreIntervalSec);
    } else if (this.activeSecondPreInterval) {
      this.preIntervalConvert =
        this.intervalConvert -
        (this.secondPreIntervalMin * 60 + this.secondPreIntervalSec);
    }
  }

  playIntervalSound() {
    if (
      this.secAlert % this.intervalConvert === 0 &&
      (this.activeFirstInterval || this.activeSecondInterval) &&
      this.running
    ) {
      this.intervalSoundBehaviour(this.AUDIO_MAIN_ALERT);
    }
  }

  playPreIntervalSound() {
    if (
      this.secAlert % this.intervalConvert === this.preIntervalConvert &&
      (this.activeFirstPreInterval || this.activeSecondPreInterval) &&
      this.running
    ) {
      this.intervalSoundBehaviour(this.AUDIO_PRE_ALERT);
    }
  }

  intervalSoundBehaviour(AUDIO_NAME: HTMLAudioElement) {
    AUDIO_NAME.play();
    AUDIO_NAME.onended = () => {
      AUDIO_NAME.pause();
      AUDIO_NAME.currentTime = 0;
    };
  }

  logDocId(docId: string) {
    this.docId = docId;
  }

  setInterval(interval: string) {
    this.toggleInterval(interval);
    this.togglePreInterval(interval);
  }

  async toggleInterval(interval: string) {
    this.value = 0;
    this.secAlert = 0;
    if (interval === 'firstInterval') {
      this.activeFirstInterval = !this.activeFirstInterval;
      this.activeSecondInterval = false;
      await this.changeActiveMainAlert(interval);
    } else if (interval === 'secondInterval') {
      this.activeSecondInterval = !this.activeSecondInterval;
      this.activeFirstInterval = false;
      await this.changeActiveMainAlert(interval);
    }
    if (!this.activeFirstInterval && !this.activeSecondInterval) {
      this.activeFirstPreInterval = false;
      this.activeSecondPreInterval = false;
      await this.changeActiveMainAlert('none');
    }
  }

  checkIntervalsOnStart() {
    this.checkFirstIntervalAtStart();
    this.checkSecondIntervalAtStart();
  }

  checkFirstIntervalAtStart() {
    const activeMainAlert = this.userVariables[0]['activeMainAlert'];
    if (activeMainAlert) {
      if (activeMainAlert === 'firstInterval') {
        this.activeFirstInterval = true;
      } else if (activeMainAlert === 'secondInterval') {
        this.activeSecondInterval = true;
      } else if (activeMainAlert === 'none') {
        this.activeFirstInterval = false;
        this.activeSecondInterval = false;
      }
    }
  }

  checkSecondIntervalAtStart() {
    const activePreAlert = this.userVariables[0]['activePreAlert'];
    if (activePreAlert) {
      if (activePreAlert === 'firstPreInterval') {
        this.activeFirstPreInterval = true;
      } else if (activePreAlert === 'secondPreInterval') {
        this.activeSecondPreInterval = true;
      } else if (activePreAlert === 'none') {
        this.activeFirstPreInterval = false;
        this.activeSecondPreInterval = false;
      }
    }
  }

  togglePreInterval(interval: string) {
    if (this.firstPreIntervalIsClicked(interval)) {
      this.activeFirstPreInterval = !this.activeFirstPreInterval;
      this.activeSecondPreInterval = false;
      this.changeActivePreAlert('firstPreInterval');
    } else if (this.secondPreIntervalIsClicked(interval)) {
      this.activeSecondPreInterval = !this.activeSecondPreInterval;
      this.activeFirstPreInterval = false;
      this.changeActivePreAlert('secondPreInterval');
    }
    if (!this.activeFirstPreInterval && !this.activeSecondPreInterval) {
      this.changeActivePreAlert('none');
    }
    this.intervalComparison();
  }

  async changeActiveMainAlert(activeMainAlert: string): Promise<void> {
    await setDoc(
      this.getSingleUserDocRef(this.docId),
      { activeMainAlert: activeMainAlert },
      { merge: true }
    );
  }

  async changeActivePreAlert(activePreAlert: string): Promise<void> {
    await setDoc(
      this.getSingleUserDocRef(this.docId),
      { activePreAlert: activePreAlert },
      { merge: true }
    );
  }

  firstPreIntervalIsClicked(interval: string) {
    return (
      interval === 'firstPreInterval' &&
      (this.activeFirstInterval || this.activeSecondInterval)
    );
  }

  secondPreIntervalIsClicked(interval: string) {
    return (
      interval === 'secondPreInterval' &&
      (this.activeFirstInterval || this.activeSecondInterval)
    );
  }

  intervalComparison() {
    const firstPreIntervalTime =
      this.firstPreIntervalMin * 60 + this.firstPreIntervalSec;
    const secondPreIntervalTime =
      this.secondPreIntervalMin * 60 + this.secondPreIntervalSec;

    this.inervalComparisonCalc(
      firstPreIntervalTime,
      this.activeFirstPreInterval
    );
    this.inervalComparisonCalc(
      secondPreIntervalTime,
      this.activeSecondPreInterval
    );
  }

  inervalComparisonCalc(preIntervalTime: number, activePreInterval: Boolean) {
    if (
      this.firstIntervalSmallerThanPreInterval(
        preIntervalTime,
        activePreInterval
      )
    ) {
      this.disablePreIntervalBtns();
      this.openSnackBar();
    } else if (
      this.secondIntervalSmallerThanPreInterval(
        preIntervalTime,
        activePreInterval
      )
    ) {
      this.disablePreIntervalBtns();
      this.openSnackBar();
      this.changeActivePreAlert('none');
    }
  }

  firstIntervalSmallerThanPreInterval(
    preIntervalTime: number,
    activePreInterval: Boolean
  ) {
    const firstIntervalTime =
      this.firstIntervalMin * 60 + this.firstIntervalSec;
    return (
      this.activeFirstInterval &&
      activePreInterval &&
      firstIntervalTime < preIntervalTime + 1
    );
  }

  secondIntervalSmallerThanPreInterval(
    preIntervalTime: number,
    activePreInterval: Boolean
  ) {
    const secondIntervalTime =
      this.secondIntervalMin * 60 + this.secondIntervalSec;
    return (
      this.activeSecondInterval &&
      activePreInterval &&
      secondIntervalTime < preIntervalTime + 1
    );
  }

  disablePreIntervalBtns() {
    this.activeFirstPreInterval = false;
    this.activeSecondPreInterval = false;
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
    });
  }

  checkBodypart(exerciseName: string): string {
    const backgroundBodypart =
      this.userVariables[0]?.exercises[exerciseName]?.bodypart;
    const backgroundImageMap: { [key: string]: string } = {
      Chest: 'url("./../../assets/img/chest-muscle.png")',
      Back: 'url("./../../assets/img/back-muscle.png")',
      Arms: 'url("./../../assets/img/arm-muscle.png")',
      Shoulders: 'url("./../../assets/img/shoulders-muscle.png")',
      Abdominal: 'url("./../../assets/img/abdominal-muscle.png")',
      Legs: 'url("./../../assets/img/legs-muscle.png")',
      Calves: 'url("./../../assets/img/calves-muscle.png")',
      Stamina: 'url("./../../assets/img/stamina-muscle.png")',
      Other: '',
    };

    const backgroundImage = backgroundImageMap[backgroundBodypart] || '';
    this.backgroundImages[exerciseName] = backgroundImage;

    return backgroundImage;
  }

  getBackgroundImage(exerciseName: string): string {
    return this.backgroundImages[exerciseName];
  }

  sortDiary() {
    const customOrder = [
      'Chest',
      'Back',
      'Legs',
      'Shoulders',
      'Arms',
      'Abdominal',
      'Calves',
      'Stamina',
      'Other',
    ];
    const exerciseBodypartPairs = this.exercisesList.map((exercise, index) => ({
      exercise: exercise,
      bodypart: this.sortBodypart[index],
    }));

    exerciseBodypartPairs.sort((a, b) => {
      const orderA = customOrder.indexOf(a.bodypart);
      const orderB = customOrder.indexOf(b.bodypart);
      return orderA - orderB || a.exercise.localeCompare(b.exercise);
    });

    this.exercisesList = exerciseBodypartPairs.map((pair) => pair.exercise);
  }

  keepScreenAwake() {
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((wakeLockObj: any) => {
          console.log('Screen kept active');
        })
        .catch((err: any) => {
          console.error('Error while activating screen:', err);
        });
    } else {
      console.warn('Screen activity API not supported');
    }
  }

  async saveLogLastSavedExercise(currentDiaryEntry: string): Promise<void> {
    const backgroundImage = this.checkBodypart(currentDiaryEntry).replace(
      './',
      './../'
    );
    await setDoc(
      this.getSingleUserDocRef(this.userId),
      { lastSavedExercise: backgroundImage },
      { merge: true }
    );
    this.lastSavedExercise = backgroundImage;
  }

  async getLastSavedExercise() {
    if (this.userId) {
      await this.subUsers(this.userId);
      if (this.userVariables[0].lastSavedExercise !== undefined) {
        this.lastSavedExercise = this.userVariables[0].lastSavedExercise;
      }
    }
  }

  async hideTime() {
    const maxRetries = 10,
      loadingIndicator = document.getElementById('loading');
    let retries = 0;

    if (loadingIndicator) {
      loadingIndicator.classList.add('hide');
    }

    while (retries < maxRetries) {
      const showHideTimeBtn = document.getElementById('showHideTime');

      if (showHideTimeBtn) {
        const isToggled = showHideTimeBtn.classList.contains('toggled');

        if (isToggled || !isToggled) {
          const showHideContent =
            document.getElementsByClassName('showHideContent');
          const diaryContent = document.getElementById('gym-diary');
          const margin = document.getElementById('gym-diary-title');
          const iconElement = showHideTimeBtn.querySelector('mat-icon');

          if (isToggled) {
            Array.from(showHideContent).forEach((c) => {
              (c as HTMLElement).classList.remove('hideTimeContent');
            });

            if (diaryContent) {
              diaryContent.style.height = 'calc(100vh - 442px)';
            }

            if (iconElement) {
              iconElement.innerHTML = 'keyboard_arrow_up';
            }

            if (margin) {
              margin.style.marginTop = '16px';
            }

            showHideTimeBtn.classList.remove('toggled');
            this.hideShowIntervalBool = false;
          } else {
            Array.from(showHideContent).forEach((c) => {
              (c as HTMLElement).classList.add('hideTimeContent');
            });

            if (diaryContent) {
              diaryContent.style.height = 'calc(100vh - 265px)';
            }

            if (iconElement) {
              iconElement.innerHTML = 'keyboard_arrow_down';
            }

            if (margin) {
              margin.style.marginTop = '0';
            }

            showHideTimeBtn.classList.add('toggled');
            this.hideShowIntervalBool = true;
          }

          break;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      retries++;
    }

    if (loadingIndicator) {
      loadingIndicator.classList.remove('hide');
    }

    if (retries >= maxRetries) {
      console.warn('hideTime konnte nicht erfolgreich abgeschlossen werden.');
    }
  }
}
