import { PaginationResponse } from "@interfaces/Pagination/PaginationResponseInterface";

export interface SupplyDTO {
    id: string;
    sku :string;
    rawMaterial :string;
    weightRemainKg: number;
    purchaseDate: string;
    expirationDate: string;
}

export interface SupplyDetailsDTO extends SupplyDTO{
    weightKg : number;
    purchaseSku: string;

}

export interface SuppliesPaginationResponseDTO extends PaginationResponse{
    supplies: SupplyDTO[];
}