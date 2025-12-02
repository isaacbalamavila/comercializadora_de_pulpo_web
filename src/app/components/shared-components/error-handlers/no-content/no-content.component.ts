import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-content',
  imports: [],
  templateUrl: './no-content.component.html',
  styleUrl: './no-content.component.css'
})
export class NoContentComponent {

  @Input() type: 'no-content' | 'no-result' = 'no-content';
  @Input() title: string = 'Sin Elementos'
  @Input() details: string | null = null;


}
