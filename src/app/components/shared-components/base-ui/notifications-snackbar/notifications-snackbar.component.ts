import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications-snackbar',
  imports: [CommonModule],
  templateUrl: './notifications-snackbar.component.html',
  styleUrl: './notifications-snackbar.component.css'
})
export class NotificationsSnackbarComponent {

  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() title:string = '';
  @Input() message: string = '';
  @Input({required: true}) duration!: number;
}
