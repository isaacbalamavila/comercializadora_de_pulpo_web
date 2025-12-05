export interface PurchaseDTO {
    id: string;
    sku: string;
    supplier: string;
    rawMaterial: string;
    totalKg: number;
    totalPrice: number;
    priceKg: number;
    createdAt: string;
}

export interface PurchaseDetailsDTO extends PurchaseDTO {
    userName:string;
    userLastName:string;
    supplierEmail: string;
    supplierPhone: string;
    rawMaterialDescription: string;
}

export interface PurchasePaginationResposne {
    page: number;
    total: number;
    totalPages: number;
    purchases: PurchaseDTO[];
}