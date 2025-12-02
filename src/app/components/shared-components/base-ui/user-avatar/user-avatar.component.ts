import { Component, input } from '@angular/core';

@Component({
  selector: 'user-avatar-square',
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarSquareComponent {

  label = input.required<string>();

}
