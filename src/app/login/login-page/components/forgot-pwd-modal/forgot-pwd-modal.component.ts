import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { BaseDirective } from "@shared/directives";
import { AuthService, ToastService } from "@shared/services";

@Component({
  selector: 'app-forgot-pwd-modal',
  templateUrl: './forgot-pwd-modal.component.html',
  styleUrls: ['./forgot-pwd-modal.component.scss']
})
export class ForgotPwdModalComponent extends BaseDirective {

  userFormGroup = new FormGroup({
    email: new FormControl('', [Validators.email])
  })

  constructor(private modalCtrl: ModalController, private authSvc: AuthService, private toastSvc: ToastService) { 
    super();
  }

  closeModal(event: 'success' | 'cancel'){
    if(event === 'success'){
      if(this.userFormGroup.valid){
        const email = this.userFormGroup.get('email').value;
        this.authSvc.checkIfUserExist(email)
          .subscribe(userExists => {
            if(userExists)
              this.modalCtrl.dismiss({ email })
            else
              this.toastSvc.addErrorToast({message: 'Non esiste un utente con la mail inserita.'})
          })
      }
    }else{
      this.modalCtrl.dismiss({email: null});
    }
  }

}
