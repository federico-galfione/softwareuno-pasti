import { Component, Input } from '@angular/core';

@Component({
  selector: '[stain-one-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195 274" fill="none">
      <g [attr.filter]="'url(#filter-' + name + ')'">
      <path d="M184.122 274C172.149 274 152.774 267.816 128.463 238.355C104.171 208.915 111.788 185.81 118.509 165.426C120.679 158.845 122.728 152.63 123.595 146.555C124.569 139.734 123.909 134.075 121.519 128.746C114.961 114.123 98.2636 109.59 78.9303 104.339C58.7232 98.847 35.8205 92.6327 18.2329 73.4863C10.3575 64.9126 4.96239 55.7138 2.19778 46.1456C-0.0127696 38.517 -0.563919 30.5053 0.581242 22.647C1.41233 16.9616 3.04782 11.4225 5.43883 6.1954C6.40065 4.04955 7.5288 1.9818 8.81302 0.0109694L8.82403 0H195V271.826C194.961 271.849 191.066 274 184.122 274Z" fill="#F7AD45"/>
      </g>
      <defs>
      <filter id="filter-{{name}}" x="0" y="-2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
      width: 100%;
      height: 100%;
    }
  `]
})
export class StainOneComponent{
  @Input()
  name: string = 'stain-one'
}
