import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ClientDTO } from '@interfaces/Clients/ClientDTO';
import { phoneFormatter } from '@utils/phone-formatter';
import { UserAvatarSquareComponent } from "@base-ui/user-avatar/user-avatar.component";

@Component({
  selector: 'client-card',
  imports: [CommonModule, UserAvatarSquareComponent],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css'
})
export class ClientCardComponent {
  client = input.required<ClientDTO>();

  //* UI Variables
  _clientlabel = computed<string>(() => {
    const parts = this.client().name.split(' ').filter(p => p.length > 0);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + (parts[2] ? parts[2][0] : parts[1][0])).toUpperCase();
    }
  });
  _phoneFormat = computed<string>(() => phoneFormatter(this.client().phone));

}
