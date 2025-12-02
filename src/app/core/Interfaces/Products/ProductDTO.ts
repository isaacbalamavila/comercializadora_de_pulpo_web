export interface ProductDTO {
    id: string;
    sku: string;
    name: string;
    description: string;
    isDeleted: boolean;
    img: string;
    rawMaterialId: number;
    rawMaterial: string;
    price: number;
}

export interface ProductDetailsDTO extends ProductDTO {
    content: number;
    unitId: number;
    unit: string;
    stockMin: number;
    rawMaterialNeededKg: number;
    timeNeededMin: number;
}

export function ProductDTOFromDetails(details: ProductDetailsDTO): ProductDTO {
    const dto: ProductDTO = { ...details };
    return dto;
}