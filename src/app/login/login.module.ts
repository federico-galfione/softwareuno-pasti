import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { GuestLoginPage } from './guest-login/guest-login.page';
import { LoginPage } from './login-page/login.page';
import { LoginPageRoutingModule } from './login-routing.module';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage, GuestLoginPage]
})
export class LoginPageModule {}
