import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, filter, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { PopupComponent } from '../shared/components/popup/popup.component';
import { User } from '../shared/models/user';
import { AuthService, Roles } from '../shared/services/auth.service';
import { menuAnimation } from './admin.animations';

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
    menuAnimation
  ]
})
export class AdminPage implements AfterViewInit {
  adminColors: {primary?: string, tint?: string} = {};
  showDeleteUserPopup: boolean = false;
  showEditUserPopup: boolean = false;
  showCreateUserPopup: boolean = false;
  popupConfig: {x: number, y: number};
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  userFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  })
  filterForm = new FormGroup({
    text: new FormControl(''),
    roles: new FormControl(['ADMIN', 'EMPLOYEE', 'RESTAURANT'])
  });
  selectedUser: User;

  constructor(private authSvc: AuthService, private router: Router, private firestore: AngularFirestore) { 
    this.adminColors.primary = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary');
    this.adminColors.tint = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary-tint');
    this.users$ = this.firestore
      .collection('users').valueChanges() as Observable<User[]>;

    this.filteredUsers$ = combineLatest([this.users$, this.filterForm.valueChanges]).pipe(map(([users, form]) => {
      return users.filter(user => 
        form.roles.includes(user.role) &&
        (
          user.email.toLowerCase().includes(form.text.toLowerCase()) ||
          user.firstName.toLowerCase().includes(form.text.toLowerCase()) ||
          user.lastName.toLowerCase().includes(form.text.toLowerCase()) 
        )
      );
    }));
  }


  async logout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }catch(e){}
  }

  ngAfterViewInit(){
    this.filterForm.setValue({
      text: '',
      roles: ['ADMIN', 'EMPLOYEE', 'RESTAURANT']
    })
  }

  selectUser(user: User){
    if(this.selectedUser?.email === user.email || user.email === this.authSvc.currentUser.email){
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }

  createUser(event: MouseEvent){
    event.stopPropagation();
    this.userFormGroup.setValue({
      email: '',
      firstName: '',
      lastName: '',
      role: 'EMPLOYEE'
    });
    this.popupConfig = {x: event.x, y: event.y};
    this.showCreateUserPopup = true;
  }

  deleteUser(event: MouseEvent){
    event.stopPropagation();
    this.popupConfig = {x: event.x, y: event.y};
    this.showDeleteUserPopup = true;
  }

  editUser(event: MouseEvent){
    event.stopPropagation();
    this.userFormGroup.patchValue(this.selectedUser);
    this.popupConfig = {x: event.x, y: event.y};
    this.showEditUserPopup = true;
  }

  cancelCreate(){
    this.showCreateUserPopup = false;
    this.selectedUser = null;
  }

  cancelDelete(){
    this.showDeleteUserPopup = false;
    this.selectedUser = null;
  }

  cancelEdit(){
    this.showEditUserPopup = false;
    this.selectedUser = null;
  }

  closePopup(e: MouseEvent, popup: PopupComponent){
    e.stopPropagation();
    popup.closePopupTrigger.next();
  }
}
