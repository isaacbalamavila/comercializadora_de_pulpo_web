export interface SupplierDTO {
    id: string;
    name: string;
    phone: string;
    email: string;
    rfc: string | null;
    isDeleted: boolean;
}

export interface SupplierDetailsDTO extends SupplierDTO {
    altPhone: string | null;
    altEmail: string | null;
    createdAt: string;
}


export function SupplierDTOFromDetails(details: SupplierDetailsDTO): SupplierDTO {

    const dto: SupplierDTO = {
        id: details.id,
        name: details.name,
        phone: details.phone,
        email: details.email,
        rfc: details.rfc,
        isDeleted: details.isDeleted
    };

    return dto;
}