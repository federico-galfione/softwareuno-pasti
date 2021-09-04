import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from "@ionic/angular";
import { AuthService, MediaService, ToastService } from '@shared/services';
import { ForgotPwdModalComponent } from "./components/forgot-pwd-modal/forgot-pwd-modal.component";

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

  constructor(private authSvc: AuthService, private router: Router, private mediaSvc: MediaService, private modalCtrl: ModalController, private toastSvc: ToastService) {
  }

  login(){
      this.authSvc.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe(user => this.router.navigate([user.role.toLowerCase()]));
  }

  async forgotPassword(){
    const modal = await this.modalCtrl.create({
      component: ForgotPwdModalComponent,
      cssClass: this.mediaSvc.isSmartphone ? 'bottom' : '',
      swipeToClose: true,
      mode: "ios"
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data.email)
      this.authSvc.sendForgotPasswordEmail(data.email)
        .subscribe({
          next: () => this.toastSvc.addSuccessToast({header: 'Mail inviata', message: 'Mail inviata con successo. Nel caso non la vedessi controlla la cartella spam.'}),
          error: () => this.toastSvc.addErrorToast({message: 'Non sono riuscito ad inviare la mail di reset password.'})
        })
  }

  ionViewDidEnter(){
    this.loginForm.setValue({
      email: '',
      password: ''
    })
  }

}
