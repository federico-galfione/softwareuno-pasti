import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, filter, map, skip, switchMap, take, takeUntil } from 'rxjs/operators';
import { PopupComponent } from '../shared/components/popup/popup.component';
import { User } from '../shared/models/user';
import { AuthService, Roles } from '../shared/services/auth.service';
import { MediaService } from '../shared/services/media.service';
import { menuAnimation, usersAnimation } from './admin.animations';

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
    menuAnimation,
    usersAnimation
  ]
})
export class AdminPage implements AfterViewInit {
  adminColors: {primary?: string, tint?: string} = {};
  isDeleteUserPopupInView: boolean = false;
  isEditUserPopupInView: boolean = false;
  isCreateUserPopupInView: boolean = false;
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  filteredUsers: User[];
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
  @ViewChild('deletePopup')
  deletePopup: PopupComponent;
  @ViewChild('editPopup')
  editPopup: PopupComponent;
  @ViewChild('createPopup')
  createPopup: PopupComponent;

  constructor(public authSvc: AuthService, private router: Router, private firestore: AngularFirestore, public mediaSvc: MediaService) { 
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

    this.filteredUsers$.subscribe(users => this.filteredUsers = users);

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

  showCreateUserPopup(event: MouseEvent){
    event.stopPropagation();
    this.userFormGroup.setValue({
      email: '',
      firstName: '',
      lastName: '',
      role: 'EMPLOYEE'
    });
    this.isCreateUserPopupInView = true;
  }

  showDeleteUserPopup(event: MouseEvent){
    event.stopPropagation();
    this.isDeleteUserPopupInView = true;
  }

  showEditUserPopup(event: MouseEvent){
    event.stopPropagation();
    this.userFormGroup.patchValue(this.selectedUser);
    this.isEditUserPopupInView = true;
  }

  createUser(){
    if(this.userFormGroup.valid){
      this.authSvc.createUser(this.userFormGroup.value)
      this.authSvc.stopLoading$.pipe(take(1)).subscribe(_ => this.closePopup(this.createPopup));
    }
  }

  editUser(){
    if(this.userFormGroup.valid){
      this.authSvc.editUser(this.userFormGroup.value)
      this.authSvc.stopLoading$.pipe(take(1)).subscribe(_ => this.closePopup(this.editPopup));
    }
  }

  deleteUser(){
    this.authSvc.deleteUser(this.selectedUser.email);
    this.authSvc.stopLoading$.pipe(take(1)).subscribe(_ => this.closePopup(this.deletePopup));
  }

  cancelCreate(){
    this.isCreateUserPopupInView = false;
    this.selectedUser = null;
  }

  cancelDelete(){
    this.isDeleteUserPopupInView = false;
    this.selectedUser = null;
  }

  cancelEdit(){
    this.isEditUserPopupInView = false;
    this.selectedUser = null;
  }

  closePopup(popup: PopupComponent, e?: MouseEvent){
    e?.stopPropagation();
    popup.closePopupTrigger.next();
  }
}
