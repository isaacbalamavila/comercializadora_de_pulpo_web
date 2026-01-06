import { PaginationResponse } from "@interfaces/Pagination/PaginationResponseInterface";

export interface ProductBatchResponse extends PaginationResponse {
    productbatches: ProductBatch[];
}

export interface ProductBatch {
    id: string;
    sku: string;
    name: string;
    price: number;
    content: number;
    unit: string;
    createdAt: string;
    expirationDate: string;
    quantity: number;
    quantityRemain: number;
}