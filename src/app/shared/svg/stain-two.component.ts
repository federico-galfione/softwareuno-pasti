import { Component, Input } from '@angular/core';

@Component({
  selector: '[stain-two-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 198 130" fill="none">
      <g [attr.filter]="'url(#filter-' + name + ')'">
      <path d="M0 129.999V6.11381C8.9923 4.15927 136.025 -22.1825 125.241 52.05C114.056 129.005 161.946 89.6686 189.283 116.974C192.375 120.063 195.281 124.52 198 129.996L0 129.999Z" fill="#F6C074"/>
      </g>
      <defs>
      <filter id="filter-{{name}}" x="-2" y="0" width="200" height="132" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
export class StainTwoComponent{
  @Input()
  name: string = 'stain-two'
}
