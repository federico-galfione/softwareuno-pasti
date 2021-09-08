import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppService } from '@shared/services';
import { BehaviorSubject, Observable } from 'rxjs';

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
  @Input()
  disableSaveButton: boolean = false;
  @Input()
  isEditPage: boolean = true;

  timer$: Observable<{hours: number, minutes: number}>;

  @Output()
  saveClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  currentPrimaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');
  currentSecondaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');;

  constructor(private el: ElementRef, private appSvc: AppService) { 
  }

  ngAfterViewInit(){
    if(this.showCountdown)
      this.timer$ = this.appSvc.getOrdersTimer();
    this.currentPrimaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color));
    this.currentSecondaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color+'-tint'));
  }

  ngOnChanges(){
    if(this.removeMargins){
      this.el.nativeElement.style.setProperty('--border-margins', '0px');
    }
  }

}
