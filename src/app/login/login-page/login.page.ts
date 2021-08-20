import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authSvc: AuthService, private router: Router) {
  }

  async login(){
      this.authSvc.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe(user => this.router.navigate([user.role.toLowerCase()]));
  }

  ionViewDidEnter(){
    this.loginForm.setValue({
      email: '',
      password: ''
    })
  }

}
