import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { UserAvatarSquareComponent } from '@base-ui/user-avatar/user-avatar.component';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { phoneFormatter } from '@utils/phone-formatter';

@Component({
  selector: 'supplier-card',
  imports: [UserAvatarSquareComponent, CommonModule],
  templateUrl: './supplier-card.component.html',
  styleUrl: './supplier-card.component.css'
})
export class SupplierCardComponent{
  supplier = input.required<SupplierDTO>();

  //* UI Variables
  _supplierlabel = computed<string>(() => {
    const parts = this.supplier().name.split(' ').filter(p => p.length > 0);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + (parts[2] ? parts[2][0] : parts[1][0])).toUpperCase();
    }
  });
  _phoneFormat = computed<string>(() => phoneFormatter(this.supplier().phone));



}
