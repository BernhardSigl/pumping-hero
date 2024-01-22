import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { LandingPageComponent } from './landing-page/LandingPageComponent';
import { TimerComponent } from './timer/timer.component';
import { FooterComponent } from '../../footer/footer.component';
import { User } from '../models/user.class';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    NavBarComponent,
    LandingPageComponent,
    TimerComponent,
    FooterComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  // user!: User;
  // userId!: string;
  // userVariables: any[] = [];

  // firstIntervalMin!: number;
  // secondIntervalMin!: number;
  // firstPreIntervalMin!: number;
  // secondPreIntervalMin!: number;

  // firestore: Firestore = inject(Firestore);

  // constructor(private route: ActivatedRoute) {
  // }

  // ngOnInit(): void {
  //   this.route.params.subscribe((params) => {
  //     this.userId = params['id'];
  //   })
  //   this.subUsers();
  // }

  // async subUsers() {
  //   const q = this.getSingleUserDocRef(this.userId);
  //   onSnapshot(q, (querySnapshot) => {
  //     let userField = querySnapshot.data();
  //     this.userVariables.push(userField);
  //     const userVariable = this.userVariables[0];
  //     this.firstIntervalMin = userVariable.firstIntervalMin;
  //     this.secondIntervalMin = userVariable.secondIntervalMin;
  //     this.firstPreIntervalMin = userVariable.firstPreIntervalMin;
  //     this.secondPreIntervalMin = userVariable.secondPreIntervalMin;
  //   });
  // }

  // getUsersColRef() {
  //   return collection(this.firestore, "users");
  // }

  // getSingleUserDocRef(docId: string) {
  //   return doc(this.getUsersColRef(), docId);
  // }
}
