import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Type,
  createComponent,
  inject,
} from '@angular/core';
import { NotificationsSnackbarComponent } from '../../components/shared-components/base-ui/notifications-snackbar/notifications-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: ComponentRef<any>[] = [];
  private readonly appRef = inject(ApplicationRef)
  private readonly injector = inject(EnvironmentInjector);


  private showNotification(
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,

    duration: number = 4000
  ) {

    const notifRef = createComponent(NotificationsSnackbarComponent, {
      environmentInjector: this.injector,
    });

    notifRef.instance.type = type;
    notifRef.instance.title = title;
    notifRef.instance.message = message;
    notifRef.instance.duration = duration;

    this.appRef.attachView(notifRef.hostView);
    const domElem = (notifRef.hostView as any).rootNodes[0] as HTMLElement;

    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('notification-container');
      document.body.appendChild(container);
    }

    container.prepend(domElem);
    this.notifications.push(notifRef);

    setTimeout(() => this.removeNotification(notifRef), duration);
  }

  private removeNotification(ref: ComponentRef<any>) {
    const index = this.notifications.indexOf(ref);
    if (index !== -1) {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      this.notifications.splice(index, 1);
    }
  }

  success(title: string, message: string, duration?: number) {
    this.showNotification('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number) {
    this.showNotification('error', title, message, duration);
  }

  info(title: string, message: string, duration?: number) {
    this.showNotification('info', title, message, duration);
  }


}
