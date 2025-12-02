import { Component, Input } from '@angular/core';

@Component({
  selector: 'copy-button',
  imports: [],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.css'
})
export class CopyButtonComponent {
  @Input({ required: true }) value?: string | null;

  isCopied: boolean = false;

  copy(): void {
    this.isCopied = true;
    this.value ? navigator.clipboard.writeText(this.value) : navigator.clipboard.writeText('');
    setTimeout(() => {
      this.isCopied = false;
    }, 500);
  }

}
