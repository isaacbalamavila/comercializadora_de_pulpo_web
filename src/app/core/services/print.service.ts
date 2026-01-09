import { inject, Injectable } from '@angular/core';
import { SaleDetailsDTO } from '@interfaces/Sales/SaleDTO';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { logoBase64 } from '../../../../public/imageBase64';
import { ClientsReport, ProductsReport, PurchasesReport, SalesReport, SuppliesReport } from '@interfaces/Reports/ReportsDTO';
import { phoneFormatter } from '@utils/phone-formatter';
import { capitalize } from '@utils/capitalize';

(pdfMake as any).vfs =
  (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private datePipe = inject(DatePipe);

  saleTicket(ticket: SaleDetailsDTO): void {

    const fileName = `ticket_${ticket.client.replaceAll(' ', '_')}-${this.datePipe.transform(ticket.date, 'yyyy-MM-dd')}-${ticket.id}`

    const estimatedHeight = 350 + (ticket.products.length * 22.5);

    const docDefinition = {
      pageSize: { width: 216, height: estimatedHeight },
      pageMargins: [10, 10, 10, 40],
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: '** La mercancía viaja por cuenta y riesgo del comprador. Cambios sujetos a políticas de la empresa. Los datos personales proporcionados serán tratados conforme a nuestro Aviso de Privacidad.',
          fontSize: 5,
          alignment: 'justify',
          margin: [10, 5, 10, 5],
          color: '#000000'
        };
      },
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 25,
              margin: [35, 5, 0, 0],
              fit: [25, 25]
            },
            {
              text: 'COMERCIALIZADORA \nDE PULPO',
              bold: true,
              fontSize: 10,
              margin: [37.5, 7.5, 0, 0]
            }
          ],
          margin: [0, 0, 0, 3]
        },
        { text: '-----------------------------------------------------------', alignment: 'center' },
        {
          text: [
            { text: 'Folio: ', bold: true },
            `${ticket.id}.`,
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'Fecha de venta: ', bold: true },
            `${this.datePipe.transform(ticket.date, 'dd/MM/YYYY hh:mm a')}.`,
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'Le atendió: ', bold: true },
            `${capitalize(ticket.employee)}.`,
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
            `${capitalize(ticket.client)}.`
          ],
          fontSize: 8,
          margin: [0, 1]
        },
        {
          text: [
            { text: 'RFC: ', bold: true },
            `${ticket.clientRfc ?? 'No agregado'}.`
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
              ...ticket.products.map(p => [
                { text: capitalize(p.name), alignment: 'left' },
                {
                  text: p.quantity, alignment: 'center'
                },
                {
                  text: `$${p.price.toFixed(2)}`, alignment: 'center'
                },
                {
                  text: `$${p.subtotal.toFixed(2)}`, alignment: 'center'
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
              text: `$${ticket.total.toFixed(2)}`,
              alignment: 'right',
              bold: true,
              fontSize: 10,
            }],
          margin: [0, 2, 0, 10]
        }
      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)

  }

  salesReport(report: SalesReport): void {

    const fileName = `reporte_ventas_${this.datePipe.transform(report.startDate, 'yyyy-MM-dd', 'UTC')}_al_${this.datePipe.transform(report.endDate, 'yyyy-MM-dd', 'UTC')}`

    var docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: 'AVISO DE PRIVACIDAD: La información contenida en este documento es confidencial y de uso exclusivo para fines internos de la Comercializadora de Pulpo. Queda prohibida su reproducción, distribución o divulgación sin autorización expresa.',
              fontSize: 8,
              alignment: 'justify',
              margin: [40, 0, 40, 0],
              color: '#666666'
            }
          ],
          margin: [0, 10, 0, 20]
        };
      },
      content: [
        {
          text: 'COMERCIALIZADORA DE PULPO',
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]

        },
        {
          text: '"REPORTE DE VENTAS"',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        {
          text: `Fecha: ${this.datePipe.transform(report.generationDate, 'dd/MM/yyy')}.`,
          alignment: 'right',
          bold: true,
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            'El presente informe constituye el reporte detallado de las actividades comerciales de la ',
            { text: 'Comercializadora de Pulpo', bold: true },
            '. En la siguiente tabla, se desglosan las ventas realizadas y registradas de manera oficial durante el periodo operativo que comprende desde el ',
            { text: this.datePipe.transform(report.startDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ' hasta el ',
            { text: this.datePipe.transform(report.endDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ', con el objetivo de facilitar el análisis de rendimiento y la toma de decisiones estratégicas.'
          ],
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Cliente', alignment: 'left', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Empleado', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Fecha', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Método de Pago', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Total', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
              ],
              ...report.sales.map(s => [
                { text: capitalize(s.client), alignment: 'left' },
                { text: capitalize(s.employee), alignment: 'center' },
                { text: `${this.datePipe.transform(s.date, 'dd/MM/yyyy')}`, alignment: 'center' },
                { text: `${capitalize(s.paymentMethod)}`, alignment: 'center' },
                { text: `$${s.total.toFixed(2)}`, alignment: 'center' }
              ])
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 7,
            paddingBottom: () => 7
          },
          fontSize: 11,
          margin: [0, 10]
        },

      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)
  }

  purchasesReport(report: PurchasesReport): void {

    const fileName = `reporte_compras_${this.datePipe.transform(report.startDate, 'yyyy-MM-dd', 'UTC')}_al_${this.datePipe.transform(report.endDate, 'yyyy-MM-dd', 'UTC')}`

    var docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: 'AVISO DE PRIVACIDAD: La información contenida en este documento es confidencial y de uso exclusivo para fines internos de la Comercializadora de Pulpo. Queda prohibida su reproducción, distribución o divulgación sin autorización expresa.',
              fontSize: 8,
              alignment: 'justify',
              margin: [40, 0, 40, 0],
              color: '#666666'
            }
          ],
          margin: [0, 10, 0, 20]
        };
      },
      content: [
        {
          text: 'COMERCIALIZADORA DE PULPO',
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]

        },
        {
          text: '"REPORTE DE COMPRAS"',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        {
          text: `Fecha: ${this.datePipe.transform(report.generationDate, 'dd/MM/yyy')}.`,
          alignment: 'right',
          bold: true,
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            'El presente informe constituye el reporte detallado de las actividades comerciales de la ',
            { text: 'Comercializadora de Pulpo', bold: true },
            '. En la siguiente tabla, se desglosan las compras realizadas y registradas de manera oficial durante el periodo operativo que comprende desde el ',
            { text: this.datePipe.transform(report.startDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ' hasta el ',
            { text: this.datePipe.transform(report.endDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ', con el objetivo de facilitar el análisis de rendimiento y la toma de decisiones estratégicas.'
          ],
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'SKU', alignment: 'left', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Proveedor', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Materia Prima', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Fecha', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Total(Kg)', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Precio (Kg)', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Total', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
              ],
              ...report.purchases.map(p => [
                { text: capitalize(p.sku), alignment: 'left' },
                { text: capitalize(p.supplier), alignment: 'center' },
                { text: capitalize(p.rawMaterial), alignment: 'center' },
                { text: `${this.datePipe.transform(p.date, 'dd/MM/yyyy')}`, alignment: 'center' },
                { text: `${p.totalKg} KG`, alignment: 'center' },
                { text: `$${p.totalKg.toFixed(2)}`, alignment: 'center' },
                { text: `$${p.totalPrice.toFixed(2)}`, alignment: 'center' }
              ])
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 7,
            paddingBottom: () => 7
          },
          fontSize: 10,
          margin: [0, 10]
        },

      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)
  }

  clientsReport(report: ClientsReport): void {

    const fileName = `reporte_clientes_${this.datePipe.transform(report.startDate, 'yyyy-MM-dd', 'UTC')}_al_${this.datePipe.transform(report.endDate, 'yyyy-MM-dd', 'UTC')}`

    var docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: 'AVISO DE PRIVACIDAD: La información contenida en este documento es confidencial y de uso exclusivo para fines internos de la Comercializadora de Pulpo. Queda prohibida su reproducción, distribución o divulgación sin autorización expresa.',
              fontSize: 8,
              alignment: 'justify',
              margin: [40, 0, 40, 0],
              color: '#666666'
            }
          ],
          margin: [0, 10, 0, 20]
        };
      },
      content: [
        {
          text: 'COMERCIALIZADORA DE PULPO',
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]

        },
        {
          text: '"REPORTE DEL REGISTRO DE CLIENTES"',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        {
          text: `Fecha: ${this.datePipe.transform(report.generationDate, 'dd/MM/yyy')}.`,
          alignment: 'right',
          bold: true,
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            'El presente documento constituye el reporte detallado de las relaciones comerciales de la ',
            { text: 'Comercializadora de Pulpo', bold: true },
            '. A continuación, se presenta la relación de clientes registrados del ',
            { text: this.datePipe.transform(report.startDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ' hasta el ',
            { text: this.datePipe.transform(report.endDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ', con el objetivo de facilitar el análisis de rendimiento y la toma de decisiones estratégicas.'
          ],
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Nombre', alignment: 'left', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Correo Electrónico', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Teléfono', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'RFC', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Fecha de Registro', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
              ],
              ...report.clients.map(c => [
                { text: capitalize(c.name), alignment: 'left' },
                { text: c.email, alignment: 'center' },
                { text: phoneFormatter(c.phone), alignment: 'center' },
                { text: c.rfc?.toUpperCase() ?? '-', alignment: 'center' },
                { text: `${this.datePipe.transform(c.createdAt, 'dd/MM/yyyy')}`, alignment: 'center' },
              ])
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 7,
            paddingBottom: () => 7,
          },
          fontSize: 11,
          margin: [0, 10]
        },

      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)
  }

  productsReport(report: ProductsReport): void {

    const fileName = `reporte__inventario_productos_${this.datePipe.transform(report.startDate, 'yyyy-MM-dd', 'UTC')}_al_${this.datePipe.transform(report.endDate, 'yyyy-MM-dd', 'UTC')}`

    var docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: 'AVISO DE PRIVACIDAD: La información contenida en este documento es confidencial y de uso exclusivo para fines internos de la Comercializadora de Pulpo. Queda prohibida su reproducción, distribución o divulgación sin autorización expresa.',
              fontSize: 8,
              alignment: 'justify',
              margin: [40, 0, 40, 0],
              color: '#666666'
            }
          ],
          margin: [0, 10, 0, 20]
        };
      },
      content: [
        {
          text: 'COMERCIALIZADORA DE PULPO',
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]

        },
        {
          text: '"REPORTE DEL INVENTARIO DE PRODUCTOS"',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        {
          text: `Fecha: ${this.datePipe.transform(report.generationDate, 'dd/MM/yyy')}.`,
          alignment: 'right',
          bold: true,
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            'El presente documento constituye el reporte detallado de la disponibilidad de productos de la ',
            { text: 'Comercializadora de Pulpo', bold: true },
            '. La siguiente tabla desglosa únicamente los productos generados entre el ',
            { text: this.datePipe.transform(report.startDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ' y el ',
            { text: this.datePipe.transform(report.endDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ', permitiendo evaluar la eficiencia operativa del periodo. ',
            'Las cantidades reflejan la disponibilidad actual de este lote específico al momento de generar el reporte.'
          ],
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              [
                { text: 'SKU', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Producto', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Contenido', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Cantidad \nDisponible', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
              ],
              ...report.products.map(p => [
                { text: p.sku, alignment: 'center' },
                { text: capitalize(p.name), alignment: 'left' },
                { text: `${p.content} ${p.unit}`, alignment: 'center' },
                { text: p.quantity, alignment: 'center' },
              ])
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 7,
            paddingBottom: () => 7
          },
          fontSize: 11,
          margin: [0, 10]
        },

      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)
  }
  suppliesReport(report: SuppliesReport): void {

    const fileName = `reporte_inventario_insumos_${this.datePipe.transform(report.startDate, 'yyyy-MM-dd', 'UTC')}_al_${this.datePipe.transform(report.endDate, 'yyyy-MM-dd', 'UTC')}`

    var docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return {
          columns: [
            {
              text: 'AVISO DE PRIVACIDAD: La información contenida en este documento es confidencial y de uso exclusivo para fines internos de la Comercializadora de Pulpo. Queda prohibida su reproducción, distribución o divulgación sin autorización expresa.',
              fontSize: 8,
              alignment: 'justify',
              margin: [40, 0, 40, 0],
              color: '#666666'
            }
          ],
          margin: [0, 10, 0, 20]
        };
      },
      content: [
        {
          text: 'COMERCIALIZADORA DE PULPO',
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]

        },
        {
          text: '"REPORTE DEL INVENTARIO DE INSUMOS"',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        {
          text: `Fecha: ${this.datePipe.transform(report.generationDate, 'dd/MM/yyy')}.`,
          alignment: 'right',
          bold: true,
          margin: [0, 5, 0, 5]
        },
        {
          text: [
            'El presente documento constituye el reporte detallado de la disponibilidad de insumos de la ',
            { text: 'Comercializadora de Pulpo', bold: true },
            '. La siguiente tabla desglosa únicamente los insumos adquiridos entre el ',
            { text: this.datePipe.transform(report.startDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ' y el ',
            { text: this.datePipe.transform(report.endDate, 'dd/MM/yyyy', 'UTC'), bold: true },
            ', permitiendo evaluar la eficiencia operativa del periodo. ',
            'Las cantidades reflejan la disponibilidad actual de este lote específico al momento de generar el reporte.'
          ],
          alignment: 'justify',
          lineHeight: 1.5,
          margin: [0, 10, 0, 0]
        },
        {
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'SKU', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Materia Prima', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Cantidad Original', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Cantidad Disponible', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Fecha de Adquisición', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
                { text: 'Fecha de Caducidad', alignment: 'center', bold: true, color: 'white', fillColor: '#000000' },
              ],
              ...report.supplies.map(s => [
                { text: s.sku, alignment: 'center' },
                { text: capitalize(s.rawMaterial), alignment: 'center' },
                { text: `${s.originalWeightKg} KG`, alignment: 'center' },
                { text: `${s.remainWeightKg} KG`, alignment: 'center' },
                { text: `${this.datePipe.transform(s.purchaseDate, 'dd/MM/yyyy')}`, alignment: 'center' },
                { text: `${this.datePipe.transform(s.expirationDate, 'dd/MM/yyyy')}`, alignment: 'center' },
              ])
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 7,
            paddingBottom: () => 7
          },
          fontSize: 11,
          margin: [0, 10]
        },

      ]
    };

    pdfMake.createPdf(docDefinition as any).download(fileName)
  }

}
