import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap, take, withLatestFrom } from 'rxjs/operators';
import { User } from '../models/User';
import { ToastService } from './toast.service';

export type Roles = 'ADMIN' | 'EMPLOYEE' | 'RESTAURANT';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser: firebase.User & {role: Roles} = null;
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public startLoading$: Observable<boolean> = this.isLoading$.asObservable().pipe(filter(x => x));
  public stopLoading$: Observable<boolean> = this.isLoading$.asObservable().pipe(filter(x => !x), map(y => !y));
  get currentUser(){
    return this._currentUser;
  }

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private toastSvc: ToastService, private fns: AngularFireFunctions) { }

  // Login 
  async login(email: string, password: string){
    try{
      await this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const user = (await this.auth.signInWithEmailAndPassword(email, password)).user
      this._currentUser = { 
        ...user, 
        role: (await this.currentUserRole(user)?.toPromise())?.get('role')
      };
      this.toastSvc.addSuccessToast({header: 'Benvenuto!', message: 'Non dovrai più eseguire il login da questo dispositivo'})
      return this.currentUser;
    }catch(e: any){
      if(e.code === 'auth/invalid-email' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found')
        this.toastSvc.addErrorToast({message: 'Email o password sbagliati.'});
      else
        this.toastSvc.addErrorToast({message: 'C\'è stato un problema durante il login.'})
    }
  }

  // Logout
  async logout(){
    try{
      await this.auth.signOut();
      this._currentUser = null;
    }catch(e: any){
      this.toastSvc.addErrorToast({message: 'Errore durante il logout.'});
    }
  }

  // Check if the user is logged, if it is and currentUser is null, evaluate currentUser
  isUserLogged(){
    if(this.currentUser) return of(true);
    const user$ = this.auth.authState;
    return user$.pipe(
      mergeMap(user => this.currentUserRole(user)),
      withLatestFrom(user$),
      map(([roleDoc, user]) => {
        if(user && roleDoc){
          this._currentUser = { ...user, role: roleDoc.get('role') };
        }
        return !!user;
      })
    )
  }

  // Get the currentUser's role
  currentUserRole(user?: firebase.User){
    return (user) ? this.firestore.collection('users').doc(user.uid).get() : of(null);
  }

  // Create a new user
  createUser(user: User){
    if(!this.isLoading$.value){
      this.isLoading$.next(true);
      const callable = this.fns.httpsCallable('createUser');
      callable(user).pipe(take(1)).subscribe(
        async res => {
          await this.auth.sendPasswordResetEmail(res.email);
          this.toastSvc.addSuccessToast({
            header: 'Utente creato!',
            message: `L'utente ${res.email} è stato creato con successo`
          })
          this.isLoading$.next(false);
        },
        err => {
          this.toastSvc.addErrorToast({
            message: 'Errore durante la creazione dell\'utente'
          });
          console.error(err);
          this.isLoading$.next(false);
        }
      );
    }
  }

  // Delete user
  deleteUser(email: string){
    if(!this.isLoading$.value){
      this.isLoading$.next(true);
      const callable = this.fns.httpsCallable('deleteUser');
      callable({email}).pipe(take(1)).subscribe(
        async res => {
          this.toastSvc.addSuccessToast({
            header: 'Utente eliminato!',
            message: `L'utente ${res.email} è stato eliminato con successo`
          })
          this.isLoading$.next(false);
        },
        err => {
          this.toastSvc.addErrorToast({
            message: 'Errore durante l\'eliminazione dell\'utente'
          });
          console.error(err);
          this.isLoading$.next(false);
        }
      );
    }
  }

  editUser(user: User){
    if(!this.isLoading$.value){
      this.isLoading$.next(true);
      const callable = this.fns.httpsCallable('editUser');
      callable(user).pipe(take(1)).subscribe(
        async res => {
          this.toastSvc.addSuccessToast({
            header: 'Utente modificato!',
            message: `L'utente ${res.email} è stato modificato con successo`
          })
          this.isLoading$.next(false);
        },
        err => {
          this.toastSvc.addErrorToast({
            message: 'Errore durante la modifica dell\'utente'
          });
          console.error(err);
          this.isLoading$.next(false);
        }
      );
    }
  }

  getUsers(): Observable<User[]>{
    return this.firestore.collection('users').valueChanges() as Observable<User[]>;
  }
}
