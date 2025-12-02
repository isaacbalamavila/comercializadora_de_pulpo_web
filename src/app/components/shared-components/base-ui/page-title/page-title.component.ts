import { Component, input, output } from '@angular/core';

@Component({
  selector: 'page-title',
  imports: [],
  template: `
          <div class="title">
            <h1>{{title()}}</h1>
            <button (click)="_onRefresh()">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 15 15">
                <path fill="none" stroke="currentColor" d="M7.5 14.5A7 7 0 0 1 3.17 2M7.5.5A7 7 0 0 1 11.83 13m-.33-3v3.5H15M0 1.5h3.5V5" stroke-width="1.5" />
              </svg>
            </button>

        </div>
  `,
  styles: [`
      .title{
        display:flex;
        gap:1rem;
        align-items:center;

        button{
          background-color:transparent;
          color: var(--primary-color);
          padding: 0;
          border-radius: 50%;
          transition: transform 0.3s ease;

          &:active{
            transform: rotate(180deg) scale(1.1);
          }
        }
      }
  `]
})
export class PageTitleComponent {

  title = input.required<string>();
  onRefresh = output<void>();

  _onRefresh(): void {
    this.onRefresh.emit()
  }


}
