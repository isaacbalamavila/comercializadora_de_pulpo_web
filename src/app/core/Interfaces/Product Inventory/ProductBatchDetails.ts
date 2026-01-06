export interface ProductBatchDetails {
    weightRemainKg(weightRemainKg: any): unknown;
    id: string;
    sku: string;
    userName: string;
    processId: string;
    product: ProductInfo;
    creationDate: string;
    expirationDate: string;
    quantity: number;
    quantityRemain: number;
}

interface ProductInfo {
    sku: string;
    name: string;
    content: number;
    unit: string;
    price: number;
}