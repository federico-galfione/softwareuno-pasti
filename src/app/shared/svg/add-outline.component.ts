import { Component } from '@angular/core';

@Component({
  selector: '[add-outline-icon]',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <path id="add-outline" d="M120,112v16m8-8H112" transform="translate(-111 -111)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </svg>
  `,
  styles: [`
    :host{
      --height-svg: 2rem;
      --width-svg: 2rem;
    }
    svg{
      height: var(--height-svg);
      width: var(--width-svg);
    }
  `]
})
export class AddOutlineComponent{}
