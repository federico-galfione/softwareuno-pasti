import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
export const menuAnimation = trigger('openClose', [
    transition(':enter', [
        style({
            transform: 'translateX(100%)'
        }),
        animate('0.2s ease-out', style({
            transform: 'translateX(0%)'
        }))
    ]),
    transition(':leave', [
      animate('0.2s ease-in', style({
            transform: 'translateX(100%)'
        }))
    ]),
  ])

export const usersAnimation = trigger('usersAnimation', [
    transition('* => *', [
        query(':enter.smartphone', style({ opacity: 0, transform: 'translateX(-100%)' }), { optional: true }),

        query(':enter.smartphone', stagger('.1s', [
            animate('.15s ease-in', style({
                opacity: 1,
                transform: 'translateX(0%)'
            }))]), { optional: true }),

        query(':leave.smartphone', stagger('.1s', [
            animate('.15s ease-out', style({
                opacity: 0,
                transform: 'translateX(-50%)'
            }))]), { optional: true }),

        query(':enter.display', style({ opacity: 0, transform: 'translateY(-100%)' }), { optional: true }),

        query(':enter.display', stagger('.1s', [
            animate('.15s ease-in', style({
                opacity: 1,
                transform: 'translateY(0%)'
            }))]), { optional: true }),

        query(':leave.display', stagger('.1s', [
            animate('.15s ease-out', style({
                opacity: 0,
                transform: 'translateY(-50%)'
            }))]), { optional: true }) 
    ]),
  ])