import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '[stain-four-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 142 172" fill="none">
      <g [attr.filter]="'url(#filter-' + name + ')'">
      <path d="M142 170.559V9.25588e-05L4.53583 0C4.53583 0 -2.55139 22.8069 0.992218 45.6141C4.53583 68.4214 27.7903 90.2371 62.0323 98.1701C96.2742 106.103 130.53 153.795 134.06 163.843C135.549 168.08 139.022 175.021 142 170.559Z" [attr.fill]="color$ | async"/>
      </g>
      <defs>
      <filter id="filter-{{name}}" x="0" y="-2" width="144" height="174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
export class StainFourComponent implements OnChanges, OnInit{
  @Input()
  type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  name: string = 'stain-four'
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
