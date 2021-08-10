import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guest-modal',
  templateUrl: './guest-modal.component.html',
  styleUrls: ['./guest-modal.component.scss'],
})
export class GuestModalComponent {

  @Input()
  secretKey: string;

  get secretLink(){
    return (this.secretKey) ? window.location.host + '/' + this.secretKey : '';
  }

  constructor(private modalCtrl: ModalController) { }

  closeModal(){
    this.modalCtrl.dismiss()
  }

}
