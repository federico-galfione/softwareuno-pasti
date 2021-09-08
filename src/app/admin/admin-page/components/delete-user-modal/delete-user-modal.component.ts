import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '@shared/models';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.scss'],
})
export class DeleteUserModalComponent {

  @Input()
  selectedUser: User;

  constructor(private modalCtrl: ModalController) { }

  closeModal(event: 'success' | 'cancel'){
    this.modalCtrl.dismiss({
      delete: event === 'success'
    })
  }

}
