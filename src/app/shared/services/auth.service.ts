import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, first, withLatestFrom, mergeMap } from 'rxjs/operators'
import  firebase  from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

export type Roles = 'ADMIN' | 'EMPLOYEE' | 'RESTAURANT';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUser: firebase.User & {role: Roles} = null;
  get currentUser(){
    return this._currentUser;
  }

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private toastSvc: ToastService) { }

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
    return (user) ? this.firestore.collection('roles').doc(user.uid).get() : of(null);
  }

}
