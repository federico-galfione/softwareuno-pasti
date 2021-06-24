import { AfterViewInit, ApplicationRef, Component, ElementRef, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Roles } from '../../services/auth.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements AfterViewInit, OnChanges {
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
  @Input()
  removeMargins: boolean = false;
  // Tell if it's a main page or a secondary page (back button)
  @Input()
  secondaryPage: boolean = false;
  currentPrimaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');
  currentSecondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');;

  constructor(private el: ElementRef) { 
  }

  ngAfterViewInit(){
    this.currentPrimaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color));
    this.currentSecondaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color+'-tint'));
  }

  ngOnChanges(){
    if(this.removeMargins){
      this.el.nativeElement.style.setProperty('--border-margins', '0px');
    }
  }

}
