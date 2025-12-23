import { PaginationResponse } from "@interfaces/Pagination/PaginationResponseInterface";

export interface ProcessDTO {
    id: string;
    productSku: string;
    user: string;
    product: string;
    quantity: number,
    startDate: string;
    endDate: string | null;
    statusId: number;

}

export interface ProcessResponseDTO extends PaginationResponse {
    processes: ProcessDTO[];
}

export interface ProcessDetailsDTO {
    id: string;
    quantity: number;
    startDate: string;
    endDate: string | null;
    product: ProductProcess;
    status: StatusProcess;
    user: UserProcess;

}

interface ProductProcess {
    sku: string;
    name: string;
    rawMaterial:string;
    rawMaterialNeededKg: number;
    content: number;
    unit: string;
}

interface UserProcess {
    name: string;
    lastName: string;
}

interface StatusProcess {
    id: number;
    label: string;
}
