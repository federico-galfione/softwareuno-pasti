import { animate, AUTO_STYLE, query, sequence, style, transition, trigger } from '@angular/animations';
export const popupAnimations = trigger('expandCollapse', [
    transition('void => display', [
      sequence([
        style({ 
          height: '4px',
          width: '4px',
          top: '{{y}}',
          left: '{{x}}',
          transform: 'scale(1)',
          borderRadius: '2000px'
        }),
        query('ion-card', style({
          height: 'fit-content',
          width: 'fit-content',
          opacity: 0,
          transform: 'scale(0.7) translateY(-100vh)'
        })),
        animate('0.2s ease-in', style({
          transform: 'scale({{scale}})'
        })),
        style({
          transform: 'scale(1)',
          height: AUTO_STYLE,
          width: AUTO_STYLE,
          top: AUTO_STYLE,
          left: AUTO_STYLE,
          borderRadius: AUTO_STYLE
        }),
        query('ion-card', sequence([
          animate('0.1s ease-out', style({
            height: 'fit-content',
            width: 'fit-content',
            opacity: 1,
            transform: 'scale(0.7) translateY(0)'
          })),
          animate('0.1s ease-in', style({
            height: 'fit-content',
            width: 'fit-content',
            transform: 'scale(1) translateY(0)'
          }))
        ])),
      ]),
    ]),
    transition('display => void', [
      sequence([
        query('ion-card', sequence([
          animate('0.1s ease-out', style({
            transform: 'scale(0.7) translateY(0)'
          })),
          animate('0.1s ease-in', style({
            opacity: 0,
            transform: 'scale(0.7) translateY(100vh)'
          }))
        ])),
        style({ 
          height: '4px',
          width: '4px',
          top: '{{y}}',
          left: '{{x}}',
          transform: 'scale({{scale}})',
          borderRadius: '2000px'
        }),
        animate('0.2s ease-out', style({
          transform: 'scale(1)'
        })),
      ])
    ]),
    transition('void => smartphone', [
      sequence([
        style({ 
          height: '4px',
          width: '4px',
          top: '{{y}}',
          left: '{{x}}',
          transform: 'scale(1)',
          borderRadius: '2000px'
        }),
        query('ion-card', style({
          opacity: 0,
          transform: 'translateY(100%)'
        })),
        animate('0.2s ease-in', style({
          transform: 'scale({{scale}})'
        })),
        style({
          transform: 'scale(1)',
          height: AUTO_STYLE,
          width: AUTO_STYLE,
          top: AUTO_STYLE,
          left: AUTO_STYLE,
          borderRadius: AUTO_STYLE
        }),
        query('ion-card', sequence([
            style({ opacity: 1 }),
            animate('0.2s ease-out', style({
                transform: 'translateY(0)'
            }))
        ])),
      ]),
    ]),
    transition('smartphone => void', [
      sequence([
        query('ion-card', sequence([
          animate('0.2s ease-in', style({
            transform: 'translateY(100%)'
          })),
          style({ opacity: 0 })
        ])),
        style({ 
          height: '4px',
          width: '4px',
          top: '{{y}}',
          left: '{{x}}',
          transform: 'scale({{scale}})',
          borderRadius: '2000px'
        }),
        animate('0.2s ease-out', style({
          transform: 'scale(1)'
        })),
      ])
    ])
  ])