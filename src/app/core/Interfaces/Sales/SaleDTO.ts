import { PaginationResponse } from "@interfaces/Pagination/PaginationResponseInterface";

export interface SalesResponse extends PaginationResponse {
    sales: SaleDTO[];
}

interface SaleDTO {
    id: string;
    employee: string;
    client: string;
    paymentMethod: string;
    date: string;
    total: number;
}

export interface SaleDetailsDTO {
    id: string;
    employee: string;
    client: string;
    clientRfc: string | null;
    paymentMethod: string;
    date: string;
    products: SaleItem[];
    total: number;
}

interface SaleItem {
    sku: string;
    name: string;
    content: number;
    unit: string;
    quantity: number;
    price: number;
    subtotal: number;
}