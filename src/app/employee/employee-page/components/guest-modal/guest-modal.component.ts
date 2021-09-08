import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from } from "rxjs";
import { take } from "rxjs/operators";

@Component({
  selector: 'app-guest-modal',
  templateUrl: './guest-modal.component.html',
  styleUrls: ['./guest-modal.component.scss'],
})
export class GuestModalComponent {

  @Input()
  secretKey: string;

  get secretLink(){
    return (this.secretKey) ? window.location.origin + '/login/' + this.secretKey: '';
  }

  constructor(private modalCtrl: ModalController) { }

  closeModal(){
    this.modalCtrl.dismiss()
  }

  shareLink(){
    const shareData = {
      title: 'Link Ospite Softwareuno',
      text: 'Accedi al seguente link per ordinare il pasto di oggi.',
      url: this.secretLink
    }
    from(navigator.share(shareData))
      .pipe(take(1))
      .subscribe(() => this.closeModal())
  }

}
