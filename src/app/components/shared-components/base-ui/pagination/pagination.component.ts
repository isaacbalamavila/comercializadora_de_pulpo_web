import { Component, output, Output } from '@angular/core';
import { NgxPaginationModule } from "ngx-pagination";

@Component({
  selector: 'pagination',
  imports: [NgxPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
   pageChange = output<number>();

  pageChanged(page: number) {
    this.pageChange.emit(page);
  }
}
