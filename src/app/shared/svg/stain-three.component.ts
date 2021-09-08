import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '[stain-three-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 262 172" fill="none">
      <g [attr.filter]="'url(#filter-' + name + ')'">
      <path d="M206.514 161.202C192.432 160.99 181.303 163.109 171.433 165.227C152.617 169.265 119.74 177.291 102.309 161.202C84.8774 145.113 94.5011 121.21 74.3023 104.744C54.1035 88.278 41.7531 91.908 14.8955 66.69C-10.139 43.183 3.65292 4.39 4.96994 0H262V172C243.856 166.126 223.142 161.452 206.514 161.202Z" [attr.fill]="color$ | async"/>
      </g>
      <defs>
      <filter id="filter-{{name}}" x="0" y="-2" width="264" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="2" dy="-2"/>
      <feGaussianBlur stdDeviation="4"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
      </filter>
      </defs>
    </svg>
  `,
  styles: [`
    svg{
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class StainThreeComponent implements OnChanges{
  @Input()
  type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  name: string = 'stain-three'
  color$: BehaviorSubject<string> = new BehaviorSubject<string>('#000');

  ngOnInit(){
    this.color$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}`).trim())
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.type){
      this.color$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}`).trim())
    }
  }
}
