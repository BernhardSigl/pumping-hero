// declare var google: any;
import { Component, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareTimeService } from '../share-time/share-time.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SnackbarLoginComponent } from '../snackbar-login/snackbar-login.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user!: User;
  firestore: Firestore = inject(Firestore);
  loading = false;

  private router = inject(Router);
  errorMessage: string = '';
  registerBtn = false;
  loginBtn = false;
  rememberMe: boolean = false;

  durationInSeconds = 3;

  // register
  auth = inject(Auth);
  showConfirmPasswordError: boolean = false;

  shareTimeService = inject(ShareTimeService);

  form: FormGroup = new FormGroup({
    regEmail: new FormControl('', [Validators.required, Validators.email]),
    logEmail: new FormControl('', [Validators.required, Validators.email]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    regPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    logPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  get regEmail() {
    return this.form.get('regEmail');
  }

  get regPassword() {
    return this.form.get('regPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  // login
  userId!: any;

  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get logEmail() {
    return this.form.get('logEmail');
  }

  get logPassword() {
    return this.form.get('logPassword');
  }
  //

  constructor(private ngZone: NgZone, private _snackBar: MatSnackBar) {
    this.auth = getAuth();
  }

  async ngOnInit():Promise<void> {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const rememberMe = localStorage.getItem('rememberMe');

    if (rememberMe === 'yes' && email && password) {
      this.form.patchValue({
        logEmail: email,
        logPassword: password,
      });
      this.rememberMe = true;
      this.checkLogInputs();
      this.login();
    }
  }

  //

  async register(): Promise<void> {
    if (this.registerBtn) {
      this.loading = true;
      this.registerBtn = false;
      this.loginBtn = true;
      await this.verifyRegister();
      this.loading = false;
    }
  }

  async verifyRegister(): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.form.value.regEmail,
        this.form.value.regPassword
      );
      const userId = userCredential.user?.uid;
      if (userId) {
        this.addField();
      }
    } catch (error) {
      this.openSnackBar();
      this.registerBtn = true;
      throw error;
    }
  }

  checkRegInputs() {
    if (
      this.regEmail?.valid &&
      this.regPassword?.valid &&
      this.confirmPassword?.valid &&
      this.form.value.regPassword === this.form.value.confirmPassword
    ) {
      this.registerBtn = true;
    } else {
      this.registerBtn = false;
    }
  }

  checkLogInputs() {
    if (
      this.logEmail?.valid &&
      this.logPassword?.valid
    ) {
      this.loginBtn = true;
    } else {
      this.loginBtn = false;
    }
  }

  async login(): Promise<void> {
    this.loginBtn = false;
    this.loading = true;
    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.form.value.logEmail.toLowerCase(),
        this.form.value.logPassword
      );
      this.isAuthenticatedSubject.next(true);
      await this.getUserByEmail(this.form.value.logEmail.toLowerCase());
      this.checkRememberMe();
      this.redirect(this.userId);
    } catch {
      this.loginBtn = true;
      this.openSnackBarLogin();
    }
    this.loading = false;
  }

  checkRememberMe() {
    if(this.rememberMe) {
      localStorage.setItem('email', this.form.value.logEmail.toLowerCase());
      localStorage.setItem('password', this.form.value.logPassword);
      localStorage.setItem('rememberMe', 'yes');
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
    }
  }

  async getUserByEmail(email: string) {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        this.userId = querySnapshot.docs[0].id;
      } else {
        console.log('No user found with email:', email);
        this.userId = '';
      }
    } catch (error) {
      console.error('Error getting user data by email:', error);
      this.userId = '';
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  required(input: string): boolean {
    return this.form.get(input)?.hasError('required') || false;
  }

  async addField() {
    this.user = new User({
      email: this.form.value.regEmail.toLowerCase(),
      exercises: {},
      firstIntervalMin: 3,
      secondIntervalMin: 4,
      firstPreIntervalMin: 0,
      secondPreIntervalMin: 0,
      firstIntervalSec: 0,
      secondIntervalSec: 0,
      firstPreIntervalSec: 10,
      secondPreIntervalSec: 15,
    });
    // await this.addUser().then((result: any) => {
    //   this.redirect(result.id);
    // });
    await this.addUser();

    this.form.patchValue({
      logEmail: this.form.value.regEmail.toLowerCase(),
      logPassword: this.form.value.regPassword,
      regEmail: '',
      regPassword: '',
      confirmPassword: ''
    });
  }

  async addUser() {
    const docRef = await addDoc(this.getUsersColRef(), this.user.toJson());
    return docRef;
  }

  getUsersColRef() {
    return collection(this.firestore, "users");
  }

  async redirect(token: string) {
    this.ngZone.run(() => {
      this.router.navigate([`user/${token}`]);
    });
  }

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openSnackBarLogin() {
    this._snackBar.openFromComponent(SnackbarLoginComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
