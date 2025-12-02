export interface EmployeeDTO {
    id: string;
    email: string;
    name: string;
    lastName: string;
    roleId: number;
    role: string;
    phone: string | null;
    isDeleted: boolean;
}

export interface EmployeeDetailsDTO extends EmployeeDTO {
    createdAt: string;
    roleDescription: string;
}

export function EmployeeDTOFromDetails(details: EmployeeDetailsDTO): EmployeeDTO {
    const dto: EmployeeDTO = { ...details }

    return dto;
}