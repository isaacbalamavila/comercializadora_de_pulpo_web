import { Component, Input } from '@angular/core';

@Component({
  selector: 'validation-text',
  imports: [],
  templateUrl: './validation-text.component.html',
  styleUrl: './validation-text.component.css'
})
export class ValidationTextComponent {
  @Input({ required: true }) isValid!: boolean;
  @Input({ required: true }) message!: string;

}
