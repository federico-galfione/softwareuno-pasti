import { animate, state, style, transition, trigger } from '@angular/animations';
export const menuAnimation = trigger('openClose', [
    state('open', style({
      transform: 'translateX(0%)'
    })),
    state('closed', style({
      transform: 'translateX(100%)'
    })),
    transition('* => closed', [
      animate('0.2s ease-out')
    ]),
    transition('* => open', [
      animate('0.2s ease-in')
    ]),
  ])