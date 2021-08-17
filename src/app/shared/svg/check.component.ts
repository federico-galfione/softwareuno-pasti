import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[check-icon]',
  template: `
    <svg viewBox="0 0 60 60">
      <defs>
        <linearGradient id="selection-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#f7ad45"/>
          <stop offset="0.415" stop-color="#f7ae47"/>
          <stop offset="1" stop-color="#f6c074"/>
        </linearGradient>
      </defs>
      <g id="select" transform="translate(-101.523 -354.903)">
        <path id="left-corner-image" d="M-442.477-245.1c3.025-11.065,11.159-30.548,31.5-35.159,17.308-3.924,25.065-15.9,28.5-24.84v60Z" transform="translate(544 660)" fill="url(#selection-gradient)"/>
        <path id="checkmark-outline" d="M114.951,128l-13.266,15.161L96,137.476" transform="translate(34.572 259.741)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
      </g>
    </svg>
  `,
  styles: [`
    svg{
      display: block;
      height: 100%;
      width: auto;
    }
  `]
})
export class CheckComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
