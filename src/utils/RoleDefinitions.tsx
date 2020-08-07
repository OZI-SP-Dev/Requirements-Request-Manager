import { RoleType } from '../api/RolesApi';

export class RoleDefinitions {

    private static userIsAdmin(roles?: RoleType[]): boolean {
        return roles !== undefined && roles.includes(RoleType.ADMIN);
    }

    private static userIsManager(roles?: RoleType[]): boolean {
        return roles !== undefined && roles.includes(RoleType.MANAGER);
    }

    static userCanAccessAdminPage(roles?: RoleType[]): boolean {
        return this.userIsAdmin(roles);
    }

    static userCanReceiveRequests(roles?: RoleType[]): boolean {
        return this.userIsManager(roles);
    }

    static userCanEditOtherUsersRequests(roles?: RoleType[]): boolean {
        return this.userIsManager(roles);
    }
}