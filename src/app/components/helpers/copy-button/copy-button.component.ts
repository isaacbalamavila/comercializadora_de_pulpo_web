import { Component, input } from '@angular/core';

@Component({
  selector: 'copy-button',
  standalone: true,
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.css'
})
export class CopyButtonComponent {

  value = input.required<string | null>();
  size = input<number>(1);

  isCopied = false;

  copy(): void {
    this.isCopied = true;
    navigator.clipboard.writeText(this.value() ?? '');
    setTimeout(() => this.isCopied = false, 500);
  }
}
