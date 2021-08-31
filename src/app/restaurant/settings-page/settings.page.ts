import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseDirective } from '@shared/directives';
import { AppSettings } from '@shared/models';
import { AppService, MediaService } from '@shared/services';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage extends BaseDirective {

  appSettings$: Observable<AppSettings>;
  settingsForm: FormGroup = new FormGroup({
    stopOrdersTime: new FormControl('', [Validators.required])
  })

  get stopOrdersTime() { return this.settingsForm.get('stopOrdersTime'); }
  get disableSaveButton() { return this.settingsForm.invalid }

  constructor(public mediaSvc: MediaService, private appSvc: AppService, private router: Router) { 
    super();
    this.appSettings$ = this.appSvc.getAppSettings();
    this.appSettings$.pipe(takeUntil(this.destroy$)).subscribe(settings => { 
      console.log(settings.stopOrdersTime.toDate().toISOString());
      this.settingsForm.patchValue({
        ...settings,
        stopOrdersTime: settings.stopOrdersTime.toDate().toISOString()
      }) 
    });
  }

  cancel(){
    this.router.navigate(['']);
  }

  async saveSettings(){
    this.appSvc.changeSettings({ 
      ...this.settingsForm.value,
      stopOrdersTime: new Date(this.settingsForm.value.stopOrdersTime)
     }).subscribe(_ => this.cancel());
  }  

}
