import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequestStatuses, RequirementsRequest } from "../api/DomainObjects";
import { InternalError, NotAuthorizedError } from "../api/InternalErrors";
import { INotesApi, NotesApiConfig } from "../api/NotesApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";
import { FilterField, FilterValue, IRequirementsRequestApi, RequestFilter, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { RoleType } from "../api/RolesApi";
import { IUserApi, UserApiConfig } from "../api/UserApi";
import { UserContext } from "../providers/UserProvider";
import { RoleDefinitions } from "../utils/RoleDefinitions";
import { useEmail } from "./useEmail";

export interface IRequestFilters {
    showAllUsers: boolean,
    fieldFilters: RequestFilter[],
    // Name of the field that the results should be sorted by
    sortBy?: FilterField,
    // Whether the sortBy field is applied in ascending order or not
    ascending?: boolean
}

export interface IRequests {
    loading: boolean,
    error: string,
    clearError: () => void,
    requestsList: IRequirementsRequestCRUD[],
    filters: IRequestFilters,
    activeFilters: FilterField[],
    setFilters: (filters: IRequestFilters) => void,
    fetchRequestById: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    submitRequest: (request: IRequirementsRequestCRUD) => Promise<IRequirementsRequestCRUD>,
    updateStatus: (request: IRequirementsRequestCRUD, status: RequestStatuses, comment?: string) => Promise<void>
    sortBy(field?: FilterField, ascending?: boolean): void,
    addFilter(fieldName: FilterField, filterValue: FilterValue, isStartsWith?: boolean): void,
    clearFilter(fieldName: FilterField): void,
    clearAllFilters(): void
}

export function useRequests(): IRequests {

    const { roles, loadingUser } = useContext(UserContext);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const [filters, setFilters] = useState<IRequestFilters>({
        showAllUsers: RoleDefinitions.userSeesAllRequestsDefault(roles),
        fieldFilters: []
    });

    const email = useEmail();
    const notesApi: INotesApi = NotesApiConfig.getApi();
    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();
    const userApi: IUserApi = UserApiConfig.getApi();

    const clearError = () => setError("");

    const submitRequest = async (request: IRequirementsRequestCRUD, saveWithoutSubmitting?: boolean) => {
        try {
            request.Status = !saveWithoutSubmitting ? RequestStatuses.SUBMITTED : RequestStatuses.SAVED;
            request.StatusDateTime = moment();
            let updatedRequest = new RequirementsRequest(await request.save());

            let newRequests = requests;
            newRequests = newRequests.filter(r => r.Id !== updatedRequest.Id);
            newRequests.unshift(updatedRequest);
            setRequests(newRequests);

            // Only send the notif if the request is new (new ID returned) and the Approver is not the Requester
            if (!saveWithoutSubmitting && request.Id !== updatedRequest.Id && updatedRequest.Approver.EMail !== updatedRequest.Requester.EMail) {
                await email.sendSubmitEmail(updatedRequest);
            }

            return updatedRequest;
        } catch (e) {
            console.error("Error trying to submit Request");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message + " Please copy your work so far and refresh the page to try again!");
                throw e;
            } else if (e instanceof Error) {
                setError(e.message + " Please copy your work so far and refresh the page to try again!");
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e + " Please copy your work so far and refresh the page to try again!");
                throw new InternalError(new Error(e));
            } else {
                setError("Unknown error occurred while trying to submit Request, please copy your work so far and refresh the page to try again!");
                throw new InternalError(new Error("Unknown error occurred while trying to submit Request, please copy your work so far and refresh the page to try again!"));
            }
        }
    }

    const updateStatus = async (request: IRequirementsRequestCRUD, status: RequestStatuses, comment?: string) => {
        try {
            if (comment || !commentMandatory(status)) {
                if (RoleDefinitions.userCanChangeStatus(request, status, await userApi.getCurrentUser(), await userApi.getCurrentUsersRoles())) {
                    let updatedRequest = await requirementsRequestApi.updateRequestStatus(request, status);

                    if (status === RequestStatuses.APPROVED) {
                        let approval = await requestApprovalsApi.submitApproval(updatedRequest);
                        updatedRequest = new RequirementsRequest(approval.Request);
                    }

                    await notesApi.submitNewNote({
                        Title: getStatusNoteTitle(status),
                        Text: comment ? comment : '',
                        RequestId: updatedRequest.Id,
                        Status: status
                    });
                    await sendStatusUpdateEmail(updatedRequest, status, comment ? comment : '');

                    let newRequests = requests;
                    newRequests = newRequests.filter(r => r.Id !== updatedRequest.Id);
                    newRequests.unshift(updatedRequest);
                    setRequests(newRequests);
                } else {
                    throw new NotAuthorizedError(undefined, "You are not authorized to change the request status to " + status);
                }
            } else {
                throw new InternalError(undefined, "You must provide comments in the 'Review Comments' field to change the status to " + status);
            }
        } catch (e) {
            console.error(`Error trying to update Request status to ${status}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to update Request status to ${status}`);
                throw new InternalError(new Error(`Unknown error occurred while trying to update Request status to ${status}`));
            }
        }
    }

    const commentMandatory = (status: RequestStatuses) => {
        return status === RequestStatuses.CANCELLED
            || status === RequestStatuses.DISAPPROVED
            || status === RequestStatuses.DECLINED;
    }

    const getStatusNoteTitle = (status: RequestStatuses): string => {
        switch (status) {
            case RequestStatuses.SAVED:
                return "Request Saved";
            case RequestStatuses.SUBMITTED:
                return "Request Submitted";
            case RequestStatuses.APPROVED:
                return "Request Approved by 2 Ltr";
            case RequestStatuses.DISAPPROVED:
                return "Request Disapproved by 2 Ltr";
            case RequestStatuses.ACCEPTED:
                return "Request Accepted by Requirements Manager";
            case RequestStatuses.DECLINED:
                return "Request Declined by Requirements Manager";
            case RequestStatuses.CITO_APPROVED:
                return "Request Approved by CITO";
            case RequestStatuses.CITO_DISAPPROVED:
                return "Request Disapproved by CITO";
            case RequestStatuses.REVIEW:
                return "Request Reviewed by Board";
            case RequestStatuses.CONTRACT:
                return "Request On Contract for Development"
            case RequestStatuses.CLOSED:
                return "Request Completed";
            case RequestStatuses.CANCELLED:
                return "Request Cancelled";
        }
    }

    const sendStatusUpdateEmail = async (request: IRequirementsRequestCRUD, status: RequestStatuses, comment: string) => {
        switch (status) {
            case RequestStatuses.SUBMITTED:
                return email.sendSubmitEmail(request);
            case RequestStatuses.APPROVED:
                return email.sendApprovalEmail(request, comment);
            case RequestStatuses.DISAPPROVED:
                return email.sendDisapprovalEmail(request, comment);
            case RequestStatuses.ACCEPTED:
                return email.sendAcceptedEmail(request, comment);
            case RequestStatuses.DECLINED:
                return email.sendDeclinedEmail(request, comment);
            case RequestStatuses.CITO_APPROVED:
                return email.sendCitoApprovedEmail(request, comment);
            case RequestStatuses.CITO_DISAPPROVED:
                return email.sendCitoDisapprovedEmail(request, comment);
            case RequestStatuses.REVIEW:
                return email.sendReviewEmail(request, comment);
            case RequestStatuses.CONTRACT:
                return email.sendContractEmail(request, comment);
            case RequestStatuses.CLOSED:
                return email.sendClosedEmail(request, comment);
            case RequestStatuses.CANCELLED:
                return email.sendCancelledEmail(request, comment);
        }
    }

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setRequests(await requirementsRequestApi.fetchRequirementsRequests(filters.fieldFilters, filters.sortBy, filters.ascending,
                filters.showAllUsers ? undefined : (await userApi.getCurrentUser()).Id));
        } catch (e) {
            console.error("Error trying to fetch Requests");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError("Unknown error occurred while trying to fetch Requests!");
                throw new InternalError(new Error("Unknown error occurred while trying to fetch Requests!"));
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchRequestById = async (requestId: number): Promise<IRequirementsRequestCRUD | undefined> => {
        try {
            setLoading(true);
            let request = requests.find(req => req.Id === requestId);
            if (!request) {
                request = await requirementsRequestApi.fetchRequirementsRequestById(requestId);
            }
            setLoading(false);
            return request;
        } catch (e) {
            console.error("Error trying to fetch Request");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError("Unknown error occurred while trying to fetch Request!");
                throw new InternalError(new Error("Unknown error occurred while trying to approve Request!"));
            }
        } finally {
            setLoading(false);
        }
    }

    const addFilter = (fieldName: FilterField, filterValue: FilterValue, isStartsWith?: boolean): void => {
        if (filterValue) {
            let newFilters = [...filters.fieldFilters];
            let oldFilterIndex = newFilters.findIndex(filter => filter.fieldName === fieldName);
            if (oldFilterIndex >= 0) {
                newFilters[oldFilterIndex].filterValue = filterValue;
                newFilters[oldFilterIndex].isStartsWith = isStartsWith;
            } else {
                newFilters.push({ fieldName: fieldName, filterValue: filterValue, isStartsWith: isStartsWith });
            }
            setFilters({ ...filters, fieldFilters: newFilters });
        } else {
            clearFilter(fieldName);
        }
    }

    const clearFilter = (fieldName: FilterField): void => {
        if (filters.fieldFilters.some(filter => filter.fieldName === fieldName)) {
            setFilters({ ...filters, fieldFilters: filters.fieldFilters.filter(filter => filter.fieldName !== fieldName) });
        }
    }

    const clearAllFilters = (): void => {
        setFilters({ ...filters, fieldFilters: [] });
    }

    useEffect(() => {
        // manager should see all requests by default
        setFilters({ showAllUsers: RoleDefinitions.userSeesAllRequestsDefault(roles), fieldFilters: [] });
    }, [roles]);

    useEffect(() => {
        // only fetch Requests after roles have been loaded
        if (!loadingUser) {
            fetchRequests();
        } // eslint-disable-next-line
    }, [filters, loadingUser]);

    return ({
        loading,
        error,
        clearError,
        requestsList: [...requests],
        filters: { ...filters },
        activeFilters: filters.fieldFilters.map(filter => filter.fieldName),
        setFilters,
        fetchRequestById,
        submitRequest,
        updateStatus,
        sortBy: (field, ascending) => {
            setFilters({ ...filters, sortBy: field, ascending });
        },
        addFilter,
        clearFilter,
        clearAllFilters,
    });
}
