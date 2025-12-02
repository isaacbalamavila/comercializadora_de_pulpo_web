import { Injectable, ApplicationRef, ComponentRef, EnvironmentInjector, Type, createComponent } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: { ref: ComponentRef<any>, result$: Subject<any> }[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  open<T>(component: Type<T>, data?: Partial<T>) {
    const result$ = new Subject<any>();
    const modalRef = createComponent(component, { environmentInjector: this.injector });

    if (data) {
      Object.assign(modalRef.instance as any, data);
    }

    this.appRef.attachView(modalRef.hostView);
    const domElem = (modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.modals.push({ ref: modalRef, result$ });

    return result$.asObservable();
  }

  close<T>(result?: T) {
    if (this.modals.length === 0) return;

    const { ref, result$ } = this.modals.pop()!;

    result$.next(result);
    result$.complete();

    this.appRef.detachView(ref.hostView);
    ref.destroy();
  }
}
