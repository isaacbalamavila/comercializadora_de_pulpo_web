
export interface ProductInventory {
    id: string;
    sku: string;
    name: string;
    rawMaterial: string;
    price: number;
    content: number;
    unit: string;
    stockMin: number;
    quantity: number;
}

export interface ProductList {
    id: string;
    sku: string;
    name: string;
    price:number;
    quantity:number;
    subtotal:number;
}