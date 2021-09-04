import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
})
export class CreateUserModalComponent {
  
  userFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('EMPLOYEE', [Validators.required])
  })

  constructor(private modalCtrl: ModalController) { }

  closeModal(event: 'success' | 'cancel'){
    if(event === 'success'){
      if(this.userFormGroup.valid){
        this.modalCtrl.dismiss({user: this.userFormGroup.value});
      }
    }else{
      this.modalCtrl.dismiss({user: null});
    }
  }

}
