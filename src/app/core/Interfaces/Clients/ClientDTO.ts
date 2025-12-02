export interface ClientDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    isDeleted: boolean;
}

export interface ClientDetailsDTO extends ClientDTO {
    rfc: string | null;
    createdAt: string;
}

export function ClientDTOFromDetails(details: ClientDetailsDTO): ClientDTO {
    const dto: ClientDTO = { ...details };
    return dto;
}