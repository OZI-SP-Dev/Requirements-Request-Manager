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

    static userCanEditOtherUsersRequests(roles?: RoleType[]): boolean {
        return this.userIsManager(roles);
    }

    static userCanAddNotes(request: IRequirementsRequest, roles?: RoleType[], currentUser?: IPerson): boolean {
        return this.userIsManager(roles) || currentUser?.Id === request.Requester.Id || currentUser?.Id === request.Approver.Id || currentUser?.Id === request.Author.Id;
    }

    static userCanChangeStatus(request: IRequirementsRequest, newStatus: RequestStatuses | null, currentUser?: IPerson, roles?: RoleType[]): boolean {
        switch (newStatus) {
            case RequestStatuses.SUBMITTED:
                return (request.Status === RequestStatuses.SUBMITTED
                    || request.Status === RequestStatuses.DISAPPROVED
                    || request.Status === RequestStatuses.DECLINED)
                    && (currentUser?.Id === request.Requester.Id
                        || currentUser?.Id === request.Author.Id);
            case RequestStatuses.APPROVED:
            case RequestStatuses.DISAPPROVED:
                return request.Status === RequestStatuses.SUBMITTED && currentUser?.Id === request.Approver.Id;
            case RequestStatuses.ACCEPTED:
            case RequestStatuses.DECLINED:
                return request.Status === RequestStatuses.APPROVED && this.userIsManager(roles);
            case RequestStatuses.REVIEW:
                return request.Status === RequestStatuses.ACCEPTED && this.userIsManager(roles);
            case RequestStatuses.CONTRACT:
                return request.Status === RequestStatuses.REVIEW && this.userIsManager(roles);
            case RequestStatuses.CLOSED:
                return request.Status === RequestStatuses.CONTRACT && this.userIsManager(roles);
            case RequestStatuses.CANCELLED:
                if (request.Status === RequestStatuses.SAVED
                    || request.Status === RequestStatuses.SUBMITTED
                    || request.Status === RequestStatuses.DISAPPROVED
                    || request.Status === RequestStatuses.DECLINED) {
                    return this.userIsManager(roles)
                        || currentUser?.Id === request.Requester.Id
                        || currentUser?.Id === request.Author.Id
                        || currentUser?.Id === request.Approver.Id;
                } else if (request.Status === RequestStatuses.APPROVED) {
                    return this.userIsManager(roles) || currentUser?.Id === request.Approver.Id;
                } else if (request.Status === RequestStatuses.ACCEPTED || request.Status === RequestStatuses.REVIEW) {
                    return this.userIsManager(roles);
                } else {
                    return false;
                }
            default:
                return false;
        }
    }
}