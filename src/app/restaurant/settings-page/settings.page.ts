import { Component, OnInit } from '@angular/core';
import { AppService, MediaService } from '@shared/services';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public mediaSvc: MediaService, private appSvc: AppService) { 
    this.appSvc.getOrdersTimer().subscribe();
  }

  ngOnInit() {}

}
