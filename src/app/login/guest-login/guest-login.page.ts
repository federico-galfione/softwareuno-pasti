import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.page.html',
  styleUrls: ['./guest-login.page.scss'],
})
export class GuestLoginPage {

  constructor(private router: Router) { }

  goToLogin(){
    this.router.navigate(['login']);
  }
}
