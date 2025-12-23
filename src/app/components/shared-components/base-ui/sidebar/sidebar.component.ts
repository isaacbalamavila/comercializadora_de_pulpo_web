import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserInfo } from '../../../../core/Interfaces/UserInfo';
import { Router, RouterModule } from '@angular/router';
import { menuItems } from '../../../../../config/routes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  //* Injections
  authService = inject(AuthService);
  sanitizer = inject(DomSanitizer);
  router = inject(Router);

  //* UI Variables

  isMinimize: boolean = true;
  safeRoutes: { route: string; label: string; exact:boolean;icon: SafeHtml }[];

  constructor() {

    const user: UserInfo | null = this.authService.getUser();

    this.safeRoutes = menuItems()
      .filter((route) =>
        user ?
          route.roles.includes(user!.role) || route.roles.includes('*')
          : route.roles.includes('*')
      )
      .map((route) => ({
        ...route,
        icon: this.sanitizer.bypassSecurityTrustHtml(route.icon)
      }));

  }

  logout() {
    this.authService.deleteSession();
    this.router.navigate(['/login']);
  }
}
