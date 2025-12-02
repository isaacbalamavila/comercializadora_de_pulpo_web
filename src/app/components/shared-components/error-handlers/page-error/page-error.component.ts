import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-error',
  imports: [],
  templateUrl: './page-error.component.html',
  styleUrl: './page-error.component.css'
})
export class PageErrorComponent implements OnInit{
  @Input() statusCode: number | undefined = 500;
  @Input() title: string | undefined = undefined;
  @Input() resourceName: string | null = null;

  ngOnInit(): void {
    this.statusCode = this.statusCode == 0 ? 500 : this.statusCode;
  }
}
