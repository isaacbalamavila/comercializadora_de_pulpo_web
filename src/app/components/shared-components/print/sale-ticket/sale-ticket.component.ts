import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { SaleDetailsDTO } from '@interfaces/Sales/SaleDTO';


@Component({
  selector: 'sale-ticket',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './sale-ticket.component.html',
  styleUrl: './sale-ticket.component.css'
})
export class SaleTicketComponent {
  sale = input.required<SaleDetailsDTO>();
  @ViewChild('saleTicket') ticketContainer!: ElementRef;

  print() {
  }
}