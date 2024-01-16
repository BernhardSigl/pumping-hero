declare var google: any;
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Firestore, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user.class';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user!: User;
  firestore: Firestore = inject(Firestore);

  private router = inject(Router);

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '48091826759-81j87796gcoeko02ls6hjvjbkunvaolj.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    })

  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  async handleLogin(response: any) {
    if (response) {
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payLoad));

      const newEmail = payLoad.email; // choosen user-email at login
      const newFirstName = payLoad.given_name;
      const newProfilePic = payLoad.picture;
      const newLocation = payLoad.locale;
      const querySnapshot = await this.getUsersDocuments();

      const existingUser = querySnapshot.docs.find(doc => doc.data()['email'] === newEmail); // email already exists?

      if (existingUser) {
        this.redirect(existingUser.id);
      } else {
        this.addField(newEmail, newFirstName, newProfilePic, newLocation);
      }
    }
  }

  // Angular / Daten lesen / Daten abrufen / Holen Sie sich mehrere Dokumente aus einer Sammlung:
  // db: "this.firestore"; cities: "collection" -> "users"; Hier: getUsersColRef()
  async getUsersDocuments() {
    const q = query(this.getUsersColRef());
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  getUsersColRef() {
    return collection(this.firestore, "users");
  }

  async addUser() {
    const docRef = await addDoc(this.getUsersColRef(), this.user.toJson());
    return docRef;
  }

  async addField(newEmail: string, newFirstName: string, newProfilePic: string, newLocation: string) {
    this.user = new User({
      firstName: newFirstName,
      picture: newProfilePic,
      location: newLocation,
      email: newEmail,
      firstInterval: 3,
      secondInterval: 4,
      firstPreInterval: 10,
      secondPreInterval: 15,
    });
    await this.addUser().then((result: any) => {
      this.redirect(result.id);
    });
  }

  async redirect(token: string) {
    this.router.navigate([`mainContent/${token}`]);
  }
}




