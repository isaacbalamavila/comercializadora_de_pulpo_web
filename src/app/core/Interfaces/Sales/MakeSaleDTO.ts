export interface MakeSaleDTO{
    userId: string;
    clientId:string;
    paymentMethodId:number;
    products: SaleItem[];
}

export interface SaleItem{
    productId:string;
    quantity: number;
}