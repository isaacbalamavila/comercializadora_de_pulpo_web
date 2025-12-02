import { Directive, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[PhoneFormat]'
})
export class PhoneDirective {

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    let digits = input.value.replace(/\D/g, '');

    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }

    let formatted = '';
    if (digits.length > 6) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    } else if (digits.length > 3) {
      formatted = digits.replace(/(\d{3})(\d+)/, '$1-$2');
    } else {
      formatted = digits;
    }

    input.value = formatted;

    setTimeout(() => {
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}