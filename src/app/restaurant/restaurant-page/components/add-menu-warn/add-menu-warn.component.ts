import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-menu-warn',
  templateUrl: './add-menu-warn.component.html',
  styleUrls: ['./add-menu-warn.component.scss'],
})
export class AddMenuWarnComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  closeModal(event: 'success' | 'cancel'){
    this.modalCtrl.dismiss({
      success: event === 'success'
    })
  }
}
