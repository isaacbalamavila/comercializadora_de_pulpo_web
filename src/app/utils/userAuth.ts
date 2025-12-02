import { RoleDetailsDTO } from "@interfaces/Employees/RoleDetailsInterface";
import { Role } from "@interfaces/Role";
import { UserInfo } from "@interfaces/UserInfo";
import { Roles } from "config/roles";

export function getUserRole(): Role | null {
    const userString = localStorage.getItem('user');

    if (!userString) return null;

    const user: UserInfo = JSON.parse(userString!);

    return { id: user.roleId, name: user.role };
}

export function isAdminOrManager(): boolean {

    const userRole = getUserRole();

    return userRole?.name === Roles.admin || userRole?.name === Roles.manager;
}