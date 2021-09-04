import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from '@shared/models';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent {

  private _selectedUser: User;
  @Input()
  set selectedUser(user: User){
    this.userFormGroup.patchValue(user);
    this._selectedUser = user;
  };
  get selectedUser(){
    return this._selectedUser;
  }

  userFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
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
