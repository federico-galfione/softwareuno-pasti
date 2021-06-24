import { Component, HostBinding, Input, Output, EventEmitter, HostListener, Host, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { PopupButton } from '../../models/popupButton';
import { MediaService } from '../../services/media.service';
import { popupAnimations } from './popup.animations';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [popupAnimations]
})
export class PopupComponent implements AfterViewInit {
  @Input()
  startingPoint: {x: number, y: number};
  @Input()
  backgroundColor: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  cancelButton: PopupButton;
  @Input()
  successButton: PopupButton;
  @Input()
  disableCancelButton: boolean;
  @Input()
  disableSuccessButton: boolean;
  @Output()
  popupClosed: EventEmitter<void> = new EventEmitter<void>();
  state: 'smartphone' | 'display' | 'void' = 'display';
  public closePopupTrigger: BehaviorSubject<'cancel' | 'success' | null> = new BehaviorSubject<'cancel' | 'success' | null>(null);
  @HostListener('click')
  onClick(){
    this.close('cancel');
  }
  @HostBinding('@expandCollapse')
  get expand(){
    return {
      value: this.state,
      params: {
        scale: Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 2,
        x: `${this.startingPoint ? (this.startingPoint.x - 2) : window.innerWidth }px`,
        y: `${this.startingPoint ? (this.startingPoint.y - 2) : window.innerHeight }px`
      }
    }
  }
  @HostListener('@expandCollapse.done')
  collapseDone(){
    this.state !== 'void' || this.popupClosed.emit();
  }

  constructor(private mediaSvc: MediaService, private el: ElementRef) { 
    this.state = (this.mediaSvc.isSmartphone) ? 'smartphone' : 'display';
    this.closePopupTrigger.pipe(skip(1)).subscribe(_ => this.state = 'void');
  }

  ngAfterViewInit(){
    this.el.nativeElement.style.setProperty('--background-color-rgb', `var(--ion-color-${this.backgroundColor}-rgb)`)
  }

  close(result: 'success' | 'cancel', event?: Event){
    event?.stopImmediatePropagation();
    this.disableCancelButton = true;
    this.disableSuccessButton = true;

    if((result === 'cancel' && this.cancelButton?.clickFunc) || (result === 'success' && this.successButton?.clickFunc)){
      let funcResult = (result === 'cancel') ? this.cancelButton.clickFunc() : this.successButton.clickFunc();
      //clickFunc must return a boolean Observable. If true close the popup, else keep it open
      funcResult.subscribe((el) => {
        if(el){
          this.closePopupTrigger.next(result);
        }else{
          this.disableCancelButton = false;
          this.disableSuccessButton = false;
        }
      });
    }else{
      this.closePopupTrigger.next(result);
    }
  }

}
