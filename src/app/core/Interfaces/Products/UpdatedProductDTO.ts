export interface UpdateProductDTO {
    name: string;
    description: string;
    price: number;
    stockMin:number;
    img: File | null;
}