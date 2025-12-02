import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ModalService } from '@services/modal.service';
import { ChangePasswordComponentModal } from '@modals/change-password/change-password-modal.component';
import { SidebarComponent } from '@base-ui/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  //- Injections
  authService = inject(AuthService);
  modalSevice = inject(ModalService);

  ngOnInit(): void {
    const user = this.authService.getUser();

    if(user?.firstLogin){
      this.modalSevice.open(ChangePasswordComponentModal);
    }
  }

}
