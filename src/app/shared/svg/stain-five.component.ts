import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '[stain-five-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 157 342" fill="none">
      <g [attr.filter]="'url(#filter-' + name + ')'">
      <path d="M3.05176e-05 342.001V0.331001C1.11336 0.197668 2.22957 0.0873333 3.34891 0H17.449C28.4319 0.905861 39.0966 4.13663 48.7359 9.478C112.881 44.778 33.769 131.326 62.636 171.184C91.503 211.042 123.573 191.684 146.024 226.984C168.475 262.284 146.024 342.001 146.024 342.001H3.05176e-05Z" [attr.fill]="color$ | async"/>
      </g>
      <defs>
      <filter id="filter-{{name}}" x="-2" y="0" width="158" height="344" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-2" dy="2"/>
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
export class StainFiveComponent implements OnChanges, OnInit{
  @Input()
  type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input()
  name: string = 'stain-five'
  color$: BehaviorSubject<string> = new BehaviorSubject<string>('#000');

  ngOnInit(){
    this.color$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}-tint`).trim())
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.type){
      this.color$.next(getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${this.type}-tint`).trim())
    }
  }
}
