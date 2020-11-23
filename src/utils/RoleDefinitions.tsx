import { IRequirementsRequest, RequestStatuses } from '../api/DomainObjects';
import { RoleType } from '../api/RolesApi';
import { IPerson } from '../api/UserApi';

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

    static userCanEditNotes(roles?: RoleType[]): boolean {
        return this.userIsManager(roles);
    }

    static userCanChangeStatus(request: IRequirementsRequest, currentUser: IPerson, newStatus: RequestStatuses, roles?: RoleType[]): boolean {
        switch (newStatus) {
            case RequestStatuses.SUBMITTED:
                return currentUser.Id === request.Requester.Id || currentUser.Id === request.Author.Id;
            case RequestStatuses.APPROVED:
                return currentUser.Id === request.Approver.Id;
            case RequestStatuses.DISAPPROVED:
                return currentUser.Id === request.Approver.Id;
            case RequestStatuses.ACCEPTED:
                return this.userIsManager(roles);
            case RequestStatuses.DECLINED:
                return this.userIsManager(roles);
            case RequestStatuses.REVIEW:
                return this.userIsManager(roles);
            case RequestStatuses.CONTRACT:
                return this.userIsManager(roles);
            case RequestStatuses.CLOSED:
                return this.userIsManager(roles);
            case RequestStatuses.CANCELLED:
                return this.userIsManager(roles)
                    || currentUser.Id === request.Requester.Id
                    || currentUser.Id === request.Author.Id
                    || currentUser.Id === request.Approver.Id;
        }
    }
}