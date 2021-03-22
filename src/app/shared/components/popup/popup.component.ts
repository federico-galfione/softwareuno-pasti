import { Component, HostBinding, Input, OnInit, Output, EventEmitter, HostListener, Host, ElementRef } from '@angular/core';
import { popupAnimations } from './popup.animations';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [popupAnimations]
})
export class PopupComponent implements OnInit {
  @Input()
  startingPoint: {x: number, y: number};
  @Output()
  cancelEmitter: EventEmitter<void> = new EventEmitter<void>();
  state: 'smartphone' | 'display' | 'void' = 'display';
  @HostListener('click')
  onClick(){
    this.state = 'void';
  }
  @HostBinding('@expandCollapse')
  get expand(){
    return {
      value: this.state,
      params: {
        scale: Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 2,
        x: `${this.startingPoint.x - 2}px`,
        y: `${this.startingPoint.y - 2}px`
      }
    }
  }
  @HostListener('@expandCollapse.done')
  collapseDone(){
    this.state !== 'void' || this.cancel();
  }

  constructor() { 
    this.state = (window.innerWidth < 768) ? 'smartphone' : 'display';
  }

  ngOnInit(){
  }

  cancel(){
    this.cancelEmitter.emit();
  }

}
