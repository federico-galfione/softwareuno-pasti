import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { AuthService, Roles } from '../shared/services/auth.service';

const autocomplete = (time, selector) => (source$) =>
  source$.pipe(
    debounceTime(time),
    switchMap((...args: any[]) => selector(...args)
        .pipe(
            takeUntil(
                source$
                    .pipe(
                        skip(1)
                    )
            )
        )
    )
  )

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      transition('* => closed', [
        animate('0.2s ease-out')
      ]),
      transition('* => open', [
        animate('0.2s ease-in')
      ]),
    ]),
    trigger('selectDeselect', [
      state('select', style({
        backgroundColor: 'var(--ion-color-tertiary)',
        color: 'var(--ion-color-tertiary-contrast)'
      })),
      state('deselect', style({
        backgroundColor: 'var(--ion-color-tertiary-contrast)',
        color: 'var(--ion-color-tertiary)'
      })),
      transition('* => select', [
        animate('0.2s ease-out')
      ]),
      transition('* => deselect', [
        animate('0.2s ease-in')
      ]),
    ]),
  ]
})
export class AdminPage {
  adminColors: {primary?: string, tint?: string} = {};
  showDeleteUserPopup: boolean = false;
  popupConfig: {x: number, y: number};
  users$: Observable<User[]>;
  filterForm = new FormGroup({
    text: new FormControl('')
  });
  filter$: BehaviorSubject<{ text: string, roles: Roles[]}> = new BehaviorSubject({text: '', roles: ['ADMIN', 'EMPLOYEE', 'RESTAURANT']});
  filterByAdmin$: Observable<boolean> = this.filter$.pipe(map(x => x.roles.includes('ADMIN')));
  filterByEmployee$: Observable<boolean> = this.filter$.pipe(map(x => x.roles.includes('EMPLOYEE')));
  filterByRestaurant$: Observable<boolean> = this.filter$.pipe(map(x => x.roles.includes('RESTAURANT')));
  filterByText$: Observable<boolean>
  selectedUser: User;

  constructor(private authSvc: AuthService, private router: Router, private firestore: AngularFirestore) { 
    this.adminColors.primary = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary');
    this.adminColors.tint = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary-tint');
    this.users$ = this.firestore.collection('users').valueChanges() as Observable<User[]>;
    this.filterForm.get('text').valueChanges.pipe(
      autocomplete(1000, term => this.filter$.next({
        ...this.filter$.value,
        text: term
      }))
    ).subscribe();
  }


  async logout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }catch(e){}
  }

  selectUser(user: User){
    if(this.selectedUser?.email === user.email || user.email === this.authSvc.currentUser.email){
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }

  toggleRole(role: Roles){
    const currentValue = this.filter$.value;
    this.filter$.next({
      ...currentValue,
      roles: (currentValue.roles.includes(role)) ? currentValue.roles.filter(x => x !== role) : [...currentValue.roles, role]
    })
  }

  deleteUser(event: MouseEvent){
    event.stopPropagation();
    this.popupConfig = {x: event.x, y: event.y};
    this.showDeleteUserPopup = true;
  }

  cancelDelete(){
    this.showDeleteUserPopup = false;
    this.selectedUser = null;
  }
}
