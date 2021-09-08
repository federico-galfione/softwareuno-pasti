import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from '@shared/guards/guest.guard';
import { GuestLoginPage } from './guest-login/guest-login.page';
import { LoginPage } from './login-page/login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  {
    path: ':secretKey',
    component: GuestLoginPage,
    canActivate: [GuestGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPageRoutingModule {}
