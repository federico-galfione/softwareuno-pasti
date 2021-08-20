import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BaseDirective } from '@shared/directives';
import firebase from 'firebase/app';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { User } from '../models/User';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

export type Roles = 'ADMIN' | 'EMPLOYEE' | 'RESTAURANT';

enum AuthLoadingKeys{
  LOGIN = 'login',
  LOGIN_AS_GUEST = 'loginAsGuest',
  LOGOUT = 'logout',
  CREATE_USER = 'createUser',
  EDIT_USER = 'editUser',
  DELETE_USER = 'deleteUser'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseDirective {

  private _currentUser: firebase.User & {role: Roles} = null;
  get currentUser(){
    return this._currentUser;
  }

  constructor(
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private toastSvc: ToastService, 
    private fns: AngularFireFunctions,
    private loadingSvc: LoadingService
  ) {
    super();
  }

  // Login 
  login(email: string, password: string){
    let user;
    const login$ = from(this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL))
      .pipe(
        switchMap(_ => from(this.auth.signInWithEmailAndPassword(email, password))),
        switchMap(credentials => { 
          user = credentials.user
          return this.currentUserDoc(user)
        }),
        map(userDoc => {
          this._currentUser = {
            ...user,
            role: userDoc.get('role')
          }
          return this.currentUser;
        }),
        take(1)
      )

      return this.loadingSvc.startLoading(
        this,
        AuthLoadingKeys.LOGIN,
        login$,
        {
          message: 'Sto eseguendo il login'
        }
      ).pipe(tap(
        _ => this.toastSvc.addSuccessToast({header: 'Benvenuto!', message: 'Non dovrai più eseguire il login da questo dispositivo'}),
        err => {
          if(err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found')
            this.toastSvc.addErrorToast({message: 'Email o password sbagliati.'});
          else
            this.toastSvc.addErrorToast({message: 'C\'è stato un problema durante il login.'})
        },
      ))
  }

  loginAsGuest(secretKey: string){
    const loginAsGuest$ = from(this.auth.currentUser)
    .pipe(
      switchMap(currentUser => {
        if(currentUser){
          return of(null);
        } else {
          return from(this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL))
          .pipe(
            switchMap(_ => this.auth.signInAnonymously()),
            catchError(_ => {
              throw 'LOGIN ERROR'
            }),
            map(credentials => {
              this._currentUser = {
                ...credentials.user,
                role: 'EMPLOYEE'
              }
              return this.currentUser;
            })
          )
        }
      })
    )

    const checkSecretKey$ = this.checkSecretKey(secretKey)
    .pipe(
      switchMap(_ => loginAsGuest$),
      catchError(err => {
        if(err === 'KEY ERROR')
          this.toastSvc.addErrorToast({ message: "La chiave inserita è sbagliata." })
        if(err === 'LOGIN ERROR')
          this.toastSvc.addErrorToast({ message: "Errore durante il login come ospite." })
        return of(false)
      }),
      map(auth => {
        if(!auth)
          return true;
        return false;
      }),
      tap(res => res || this.toastSvc.addSuccessToast({header: 'Benvenuto!', message: 'Avrai accesso all\'applicazione per questa giornata.'}))
    )
    
    return this.loadingSvc.startLoading(
      this,
      AuthLoadingKeys.LOGIN_AS_GUEST,
      checkSecretKey$,
      {
        message: 'Sto eseguendo l\'accesso all\'app come ospite'
      }
    )
  }

  private checkSecretKey(key: string){
    const callable = this.fns.httpsCallable('checkSecretLink');
    return callable({ key }).pipe(take(1)).pipe(
      catchError(err => { 
        throw 'KEY ERROR';
      })
    );
  }

  // Logout
  logout(){
    return this.loadingSvc.startLoading(
      this,
      AuthLoadingKeys.LOGOUT,
      from(this.auth.signOut()),
      {
        message: 'Sto eseguendo il logout.'
      }
    ).pipe(tap(
      _ => this._currentUser = null, 
      _ => this.toastSvc.addErrorToast({message: 'Errore durante il logout.'})
    ))
  }

  // Check if the user is logged, if it is and currentUser is null, evaluate currentUser
  isUserLogged(){
    if(this.currentUser) return of(true);
    const user$ = this.auth.authState;
    return user$.pipe(
      switchMap(user => this.currentUserDoc(user)),
      withLatestFrom(user$),
      map(([roleDoc, user]) => {
        if(user && roleDoc){
          this._currentUser = { ...user, role: roleDoc.get('role') || 'EMPLOYEE' };
        }
        return !!user;
      })
    )
  }

  // Get the currentUser's role
  currentUserDoc(user?: firebase.User): Observable<firebase.firestore.DocumentSnapshot<User>>{
    return (user) ? this.firestore.collection('users').doc<User>(user.uid).get() : of(null);
  }

  // Create a new user
  createUser(user: User){
      const callable = this.fns.httpsCallable('createUser');
      return this.loadingSvc.startLoading(
        this,
        AuthLoadingKeys.CREATE_USER,
        callable(user).pipe(
          switchMap(res => {
            from(this.auth.sendPasswordResetEmail(res.email));
            return of(res);
          })
        ),
        {
          message: 'Sto creando l\'utente.'
        }
      ).pipe(tap(res => this.toastSvc.addSuccessToast({
          header: 'Utente creato!',
          message: `L'utente ${res.email} è stato creato con successo. È stata inviata una mail per la modifica della password.`
        }),
        _ => this.toastSvc.addErrorToast({
          message: 'Errore durante la creazione dell\'utente'
        })
      ))
  }

  // Delete user
  deleteUser(email: string){
      const callable = this.fns.httpsCallable('deleteUser');
      return this.loadingSvc.startLoading(
        this, 
        AuthLoadingKeys.DELETE_USER,
        callable({email}),
        {
          message: 'Sto eliminando l\'utente selezionato.'
        }
      ).pipe(tap(res => {
          this.toastSvc.addSuccessToast({
            header: 'Utente eliminato!',
            message: `L'utente ${res.email} è stato eliminato con successo`
          })
        },
        _ => {
          this.toastSvc.addErrorToast({
            message: 'Errore durante l\'eliminazione dell\'utente'
          });
        }
      ))
  }

  // Edit user
  editUser(user: User){
      const callable = this.fns.httpsCallable('editUser');
      return this.loadingSvc.startLoading(
        this,
        AuthLoadingKeys.EDIT_USER,
        callable(user),
        {
          message: 'Sto modificando l\'utente selezionato.'
        }
      ).pipe(tap(
        res => {
          this.toastSvc.addSuccessToast({
            header: 'Utente modificato!',
            message: `L'utente ${res.email} è stato modificato con successo`
          })
        },
        _ => {
          this.toastSvc.addErrorToast({
            message: 'Errore durante la modifica dell\'utente'
          });
        }
      ));
  }

  getUsers(): Observable<User[]>{
    return this.firestore.collection('users').valueChanges() as Observable<User[]>;
  }
}
