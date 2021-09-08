import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {

  @Input()
  infoModalType: "frequentiInfo" | "fissiInfo";

  constructor(private modalCtrl: ModalController) { }

  closeModal(){
    this.modalCtrl.dismiss()
  }

}
