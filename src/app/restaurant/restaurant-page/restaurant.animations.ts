import { animate, style, transition, trigger } from '@angular/animations';

export const fabAnimation = trigger('fabAnimation', [
    transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('0.1s ease-out',
            style({
                transform: 'translateX(0)'
            }))
    ]),
    transition(':leave', [
        animate('0.1s ease-in',
        style({
            transform: 'translateX(100%)'
        }))
    ]),
])