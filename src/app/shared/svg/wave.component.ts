import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: '[wave-icon]',
  template: `
    <svg class="image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" preserveAspectRatio="none">
      <defs>
        <linearGradient id="{{name}}-svg" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" [attr.stop-color]="mainColor$ | async"/>
          <stop offset="1" [attr.stop-color]="tintColor$ | async"/>
        </linearGradient>
      </defs>
      <path d="M-442.477-245.1c3.025-11.065,11.159-30.548,31.5-35.159,17.308-3.924,25.065-15.9,28.5-24.84v60Z" transform="translate(442.477 305.097)" [attr.fill]="'url(#' + name +'-svg)'"/>
    </svg>
  `,
  styles: [`
    :host{
      --svg-position: absolute;
      --svg-height: 100%;
      --svg-width: 100%;
    }
    :host svg{
      display: block;
      position: var(--svg-position);
      height: var(--svg-height);
      width: var(--svg-width);
    }
  `]
})
export class WaveComponent implements OnChanges{
  @Input()
  name: string = 'wave';
  @Input()
  type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  mainColor$: BehaviorSubject<string> = new BehaviorSubject<string>('#000');
  tintColor$: BehaviorSubject<string> = new BehaviorSubject<string>('#000');
  ngOnChanges(changes: SimpleChanges){
    if(changes.type){
      this.mainColor$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}`).trim())
      this.tintColor$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}-tint`).trim());
    }
  }
}
