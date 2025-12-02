import { Component, Input } from '@angular/core';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { EmailButtonComponent } from '@helpers/email-button/email-button.component';

@Component({
  selector: 'email',
  imports: [CopyButtonComponent, EmailButtonComponent],
  templateUrl: './mail-helper.component.html',
  styleUrl: './mail-helper.component.css'
})
export class MailHelperComponent {
  @Input({ required: true }) email: string | undefined = undefined;
  @Input() showIcon: boolean = true;
  @Input() label: string = 'Correo';
  @Input() showLabel: boolean = false;
  @Input() fontSize: number = 1;
  @Input() showOptions: boolean = true;
  @Input() emptyLabel:string='No agregado';

}
