import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notifications-snackbar',
  imports: [CommonModule],
  templateUrl: './notifications-snackbar.component.html',
  styleUrl: './notifications-snackbar.component.css'
})
export class NotificationsSnackbarComponent {

  type: 'success' | 'error' | 'info' | 'warning' = 'info';
  title: string = '';
  message: string = '';
  duration!: number;
}
