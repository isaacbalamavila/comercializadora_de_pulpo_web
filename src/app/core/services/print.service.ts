import { inject, Injectable } from '@angular/core';
import { SaleDetailsDTO } from '@interfaces/Sales/SaleDTO';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { logoBase64 } from '../../../../public/imageBase64';

(pdfMake as any).vfs =
  (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private datePipe = inject(DatePipe);

  saleTicket(sale: SaleDetailsDTO): void {

    const fileName = `venta_${sale.client.replaceAll(' ', '_')}-${this.datePipe.transform(sale.date, 'dd-MM-yyyy')}`

    const docDefinition = {
      pageSize: { width: 216, height: 360 },
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 25,
              margin: [30, 5, 0, 0],
              fit: [25, 25]
            },
            {
              text: 'COMERCIALIZADORA \nDE PULPO',
              bold: true,
              fontSize: 10,
              margin: [35, 7.5, 0, 0]
            }
          ],
          margin: [0, 0, 0, 3]
        },
        { text: '-----------------------------------------------------------', alignment: 'center' },
        {
          text: [
            { text: 'Folio: ', bold: true },
            `${sale.id}.`,
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'Fecha de venta: ', bold: true },
            `${this.datePipe.transform(sale.date, 'dd/MM/YYYY hh:mm a')}.`,
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'Le atendió: ', bold: true },
            `${this.capitalize(sale.employee)}.`,
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        { text: '-----------------------------------------------------------', alignment: 'center' },
        { text: 'Información de la empresa:', bold: true, fontSize: 9, margin: [0, 1] },
        {
          text: [
            { text: 'Dirección: ', bold: true },
            'Calle Pescadores #123, Col. Puerto Progreso, Yucatán. C.P. 97320.'
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'RFC: ', bold: true },
            'CMA251231XXX.'
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        { text: '-----------------------------------------------------------', alignment: 'center' },
        { text: 'Información del cliente:', bold: true, fontSize: 9, margin: [0, 1] },
        {
          text: [
            { text: 'Cliente: ', bold: true },
            `${this.capitalize(sale.client)}.`
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'RFC: ', bold: true },
            `${sale.clientRfc ?? 'No agregado'}.`
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        { text: '-----------------------------------------------------------', alignment: 'center' },
        { text: 'Productos comprados:', bold: true, fontSize: 9, margin: [0, 1] },
        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Producto', alignment: 'left', bold: true },
                { text: 'Cantidad', alignment: 'center', bold: true },
                { text: 'Precio', alignment: 'center', bold: true },
                { text: 'Subtotal', alignment: 'center', bold: true },
              ],
              ...sale.products.map(p => [
                { text: this.capitalize(p.name), alignment: 'left' },
                {
                  text: p.quantity, alignment: 'center'
                },
                {
                  text: `$${p.price.toFixed(2)}`, alignment: 'center'
                },
                {
                  text: `$${p.subtotal.toFixed(2)}`, aligment: 'center'
                }
              ])
            ]
          },
          layout: {
            hLineWidth: (i: number) => {
              return (i === 0 || i === 1) ? 1 : 0.5;
            },
            vLineWidth: () => 0,
            hLineColor: () => '#000000'
          },
          fontSize: 8,
          margin: [0, 2]
        },
        {
          text: [
            {
              text: `Total:  `,
              alignment: 'right',
              bold: true,
              fontSize: 8.5,

            },
            {
              text: `$${sale.total.toFixed(2)}`,
              alignment: 'right',
              bold: true,
              fontSize: 10,
            }],
          margin: [0, 2]
        },
        {
          text: '** La mercancía viaja por cuenta y riesgo del comprador. Cambios sujetos a políticas de la empresa. Los datos personales proporcionados serán tratados conforme a nuestro Aviso de Privacidad.',
          fontSize: 6,
          margin: [0, 10]
        }
      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)

  }

  //* Helper Function
  private capitalize(text: string): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
