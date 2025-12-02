import { Component, Input } from '@angular/core';

@Component({
  selector: 'error-span',
  imports: [],
  templateUrl: './error-span.component.html',
  styleUrl: './error-span.component.css'
})
export class ErrorSpanComponent {
  @Input({required: true}) message = '';
}
