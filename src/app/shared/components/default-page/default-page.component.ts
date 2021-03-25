import { AfterViewInit, ApplicationRef, Component, ElementRef, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Roles } from '../../services/auth.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements AfterViewInit {
  @Input()
  color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  title: string;
  @Input()
  subtitle: string;
  @Input()
  sectionTitle: string;
  @Input()
  showCountdown: boolean = true;
  currentPrimaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');
  currentSecondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');;

  constructor() { 
  }

  ngAfterViewInit(){
    this.currentPrimaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color));
    this.currentSecondaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color+'-tint'));
  }

}
