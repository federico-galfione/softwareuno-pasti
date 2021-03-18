import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  adminColors: {primary?: string, tint?: string} = {};
  users$: Observable<User[]>;
  constructor(private authSvc: AuthService, private router: Router, private firestore: AngularFirestore) { 
    this.adminColors.primary = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary');
    this.adminColors.tint = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-tertiary-tint');
    this.users$ = this.firestore.collection('users').valueChanges() as Observable<User[]>;
  }

  ngOnInit() {
  }

  async logout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }catch(e){}
  }
}
