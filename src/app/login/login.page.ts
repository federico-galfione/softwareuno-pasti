import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

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
    try{
      const user = await this.authSvc.login(this.loginForm.get('email').value, this.loginForm.get('password').value);
      this.router.navigate([user.role.toLowerCase()]);
    }catch(e){
      console.log(e);
    }
  }

}
