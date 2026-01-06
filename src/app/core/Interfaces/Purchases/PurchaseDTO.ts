import { PaginationResponse } from "@interfaces/Pagination/PaginationResponseInterface";

export interface PurchaseDTO {
    id: string;
    sku: string;
    supplier: string;
    rawMaterial: string;
    totalKg: number;
    priceKg: number;
    totalPrice: number;
    createdAt: string;
}

export interface PurchaseDetailsDTO extends PurchaseDTO {
    userName:string;
    userLastName:string;
    supplierEmail: string;
    supplierPhone: string;
    rawMaterialDescription: string;
}

export interface PurchasesResposne extends PaginationResponse{
    purchases: PurchaseDTO[];
}