import { Component, Input } from '@angular/core';

@Component({
  selector: 'email-button',
  imports: [],
  templateUrl: './email-button.component.html',
  styleUrl: './email-button.component.css'
})
export class EmailButtonComponent {
  @Input({required:true}) email?:string;
}
