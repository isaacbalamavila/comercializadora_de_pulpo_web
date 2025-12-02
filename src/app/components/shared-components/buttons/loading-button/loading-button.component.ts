import { Component, input, output, computed } from '@angular/core';
import { SmallLoaderComponent } from "@loaders/small-loader/small-loader.component";

@Component({
  selector: 'loading-button',
  imports: [SmallLoaderComponent],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.css'
})
export class LoadingButtonComponent {

  //* UI Variables
  label = input.required<string>();
  isLoading = input.required<boolean>();
  disabled = input<boolean>(false);
  btnStyle = input<'delete' | 'restore' | 'default'>('default');
  type = input<'button' | 'submit'>('button');

  onClick = output<void>();

  btnClass = computed(() => {
    return {
      delete: 'btn-red-modal',
      restore: 'btn-green-modal',
      default: ''
    }[this.btnStyle()];
  });

  _onClick() {
    this.onClick.emit();
  }

}
