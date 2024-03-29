import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { enterFromRightAnimation } from '@shared/animations';
import { LogoutModalComponent } from "@shared/components/logout-modal/logout-modal.component";
import { User } from '@shared/models';
import { AuthService, MediaService } from '@shared/services';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { usersAnimation } from '../admin.animations';
import { CreateUserModalComponent } from './components/create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations: [
    usersAnimation,
    enterFromRightAnimation
  ]
})
export class AdminPage implements AfterViewInit {
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  filteredUsers: User[];
  filterForm = new FormGroup({
    text: new FormControl(''),
    roles: new FormControl(['ADMIN', 'EMPLOYEE', 'RESTAURANT'])
  });
  selectedUser: User;

  trackByEmail = (index: number, item: User) => item.email;

  constructor(public authSvc: AuthService, private router: Router, public mediaSvc: MediaService, private modalCtrl: ModalController) { 
    this.users$ = this.authSvc.getUsers();

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
    const modal = await this.modalCtrl.create({
      component: LogoutModalComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios"
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data.logout)
      this.authSvc.logout().subscribe(_ => this.router.navigate(['']));
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

  async createUser(event: MouseEvent){
    event.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: CreateUserModalComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios"
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data?.user){
      this.authSvc.createUser(data.user).subscribe();
    }
  }

  async deleteUser(event: MouseEvent){
    event.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: DeleteUserModalComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios",
      componentProps: {
        selectedUser: this.selectedUser
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data?.delete){
      this.authSvc.deleteUser(this.selectedUser.email).subscribe();
    }
  }

  async editUser(event: MouseEvent){
    event.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: EditUserModalComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios",
      componentProps: {
        selectedUser: this.selectedUser
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data?.user){
      this.authSvc.editUser(data.user).subscribe();
    }
  }

  cancel(){
    this.selectedUser = null;
  }
}
