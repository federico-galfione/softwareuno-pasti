import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  users = [
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
    {
      email: 'federico.galfione@gmail.com',
      firstName: 'Federico',
      lastName: 'Galfione'
    },
  ]

  constructor(private authSvc: AuthService, private router: Router, private el: ElementRef) { }

  ngOnInit() {
  }

  async logout(){
    try{
      await this.authSvc.logout();
      this.router.navigate(['']);
    }catch(e){}
  }
}
