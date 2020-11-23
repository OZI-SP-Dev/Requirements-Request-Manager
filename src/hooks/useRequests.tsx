import moment from "moment";
import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequestStatuses, RequirementsRequest } from "../api/DomainObjects";
import { InternalError, NotAuthorizedError } from "../api/InternalErrors";
import { INotesApi, NotesApiConfig } from "../api/NotesApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { IUserApi, UserApiConfig } from "../api/UserApi";
import { RoleDefinitions } from "../utils/RoleDefinitions";
import { useEmail } from "./useEmail";

export interface IRequestFilters {
    showAllUsers: boolean
}

export interface IRequests {
    loading: boolean,
    error: string,
    clearError: () => void,
    requestsList: IRequirementsRequestCRUD[],
    filters: IRequestFilters,
    setFilters: (filters: IRequestFilters) => void,
    fetchRequestById: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    submitRequest: (request: IRequirementsRequestCRUD) => Promise<IRequirementsRequestCRUD>,
    updateStatus: (request: IRequirementsRequestCRUD, status: RequestStatuses, comment?: string) => Promise<void>,
    deleteRequest: (request: IRequirementsRequestCRUD) => Promise<void>
}

export function useRequests(): IRequests {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const [filters, setFilters] = useState<IRequestFilters>({ showAllUsers: false });

    const email = useEmail();
    const notesApi: INotesApi = NotesApiConfig.getApi();
    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();
    const userApi: IUserApi = UserApiConfig.getApi();

    const clearError = () => setError("");

    const submitRequest = async (request: IRequirementsRequestCRUD) => {
        try {
            request.Status = RequestStatuses.SUBMITTED;
            request.StatusDateTime = moment();
            let updatedRequest = new RequirementsRequest(await request.save());

            let newRequests = requests;
            let oldRequestIndex = newRequests.findIndex(req => req.Id === updatedRequest.Id);
            if (oldRequestIndex > -1) {
                newRequests[oldRequestIndex] = updatedRequest;
            } else {
                newRequests.push(updatedRequest);
            }
            setRequests(newRequests);

            // Only send the notif if the request is new (new ID returned) and the Approver is not the Requester
            if (request.Id !== updatedRequest.Id && updatedRequest.Approver.EMail !== updatedRequest.Requester.EMail) {
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
            if (RoleDefinitions.userCanChangeStatus(request, await userApi.getCurrentUser(), status, await userApi.getCurrentUsersRoles())) {
                request.Status = status;
                request.StatusDateTime = moment();
                let updatedRequest = new RequirementsRequest(await request.save());

                if (status === RequestStatuses.APPROVED) {
                    let approval = await requestApprovalsApi.submitApproval(updatedRequest, comment);
                    updatedRequest = new RequirementsRequest(approval.Request);
                }

                await notesApi.submitNewNote({
                    Title: `Status set to ${status}`,
                    Text: comment ? comment : '',
                    RequestId: updatedRequest.Id,
                    Status: status
                });
                await sendStatusUpdateEmail(updatedRequest, status, comment ? comment : '');

                let newRequests = requests;
                requests[newRequests.findIndex(req => req.Id === updatedRequest.Id)] = updatedRequest;
                setRequests(newRequests);
            } else {
                throw new NotAuthorizedError(undefined, "You are not authorized to change the request status to " + status);
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

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        try {
            await request.delete();
            setRequests(requests.filter(req => req.Id !== request.Id));
        } catch (e) {
            console.error("Error trying to delete Request");
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
                setError("Unknown error occurred while trying to delete Request!");
                throw new InternalError(new Error("Unknown error occurred while trying to delete Request!"));
            }
        }
    }

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setRequests(await requirementsRequestApi.fetchRequirementsRequests(
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

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, [filters]);

    return ({
        loading,
        error,
        clearError,
        requestsList: requests,
        filters,
        setFilters,
        fetchRequestById,
        submitRequest,
        updateStatus,
        deleteRequest
    });
}