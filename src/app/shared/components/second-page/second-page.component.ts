import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.scss'],
})
export class SecondPageComponent implements AfterViewInit, OnChanges {
  @Input()
  color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  title: string;
  @Input()
  subtitle: string;
  @Input()
  removeMargins: boolean = false;
  currentPrimaryColor: BehaviorSubject<string> = new BehaviorSubject<string>('#000');

  constructor(private el: ElementRef) { 
  }

  ngAfterViewInit(){
    this.currentPrimaryColor.next(getComputedStyle(document.documentElement).getPropertyValue('--ion-color-'+this.color));
  }

  ngOnChanges(){
    if(this.removeMargins){
      this.el.nativeElement.style.setProperty('--border-margins', '0px');
    }
  }
}
