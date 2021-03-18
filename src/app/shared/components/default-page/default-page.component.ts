import { ApplicationRef, Component, ElementRef, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { Roles } from '../../services/auth.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements OnChanges {
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
  private currentPrimaryColor: string;
  private currentSecondaryColor: string;

  constructor() { 
  }

  ngOnChanges(){
    this.currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color);
    this.currentSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color+'-tint');
  }

}
