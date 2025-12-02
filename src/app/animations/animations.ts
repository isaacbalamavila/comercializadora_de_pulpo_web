import { trigger, transition, style, animate } from '@angular/animations';

// Animación de Fade (desvanecimiento)
export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0 }))
  ])
]);

// Animación de deslizamiento desde arriba
export const slideInFromTop = trigger('slideInFromTop', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate('200ms ease-out', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
  ])
]);

//Animación de deslizamiento desde la derecha
export const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 1 }),
    animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 1 }))
  ])
]);

export const collapseFromSides = trigger('collapseFromSides', [
  transition(':enter', [
    style({ transform: 'scaleX(0)', transformOrigin: 'center center', opacity: 0 }),
    animate('200ms ease-out', style({ transform: 'scaleX(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'scaleX(0)', opacity: 0 }))
  ])
]);

export const collapseVerticallyFromCenter = trigger('collapseVerticallyFromCenter', [
  transition(':enter', [
    style({
      transform: 'scaleY(0)',
      transformOrigin: 'center center',
      opacity: 0
    }),
    animate('300ms ease-out', style({
      transform: 'scaleY(1)',
      opacity: 1
    }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({
      transform: 'scaleY(0)',
      opacity: 0
    }))
  ])
]);

export const fadeSlideList = trigger('fadeSlideList', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate('100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
  ])
]);

export const popupAnimation = trigger('popupAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
  ])
]);