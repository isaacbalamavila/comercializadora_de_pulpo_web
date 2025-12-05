export interface CreatePurchaseDTO {
    supplierId: string;
    rawMaterialId:string;
    totalKg:number;
    totalPrice:number;
}

export interface CreatePurchaseRequest extends CreatePurchaseDTO{
    userId:string;
}