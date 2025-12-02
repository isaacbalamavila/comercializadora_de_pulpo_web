import { Component } from '@angular/core';
import { BrandSpanComponent } from "@shared-components/brand-span/brand-span.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [BrandSpanComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

}
