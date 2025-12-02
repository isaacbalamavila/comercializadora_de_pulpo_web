export interface CreateProductDTO {
    img: File;
    name: string;
    description: string;
    rawMaterialId: number;
    content: number;
    unitId: number;
    price: number;
    stockMin: number;
    rawMaterialNeededKg: number;
    timeNeededMin: number;
}