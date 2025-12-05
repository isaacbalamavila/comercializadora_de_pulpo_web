import { Component, input, output } from '@angular/core';

@Component({
  selector: 'paginacion-backend',
  imports: [],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent {
  totalPages = input.required<number>();
  currentPage = input.required<number>();

  pageChange = output<number>();

  get pages() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  pageChanged(page: number) {
    this.pageChange.emit(page)
  }

}
