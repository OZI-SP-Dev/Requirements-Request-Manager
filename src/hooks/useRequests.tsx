import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";
import { IUserApi, UserApiConfig } from "../api/UserApi";
import { InternalError } from "../api/InternalErrors";

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
    submitRequest: (request: IRequirementsRequestCRUD) => Promise<void>,
    submitApproval: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    deleteRequest: (request: IRequirementsRequestCRUD) => Promise<void>
}

export function useRequests(): IRequests {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const [filters, setFilters] = useState<IRequestFilters>({ showAllUsers: false });

    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();
    const userApi: IUserApi = UserApiConfig.getApi();

    const clearError = () => setError("");

    const submitRequest = async (request: IRequirementsRequestCRUD) => {
        try {
            let updatedRequest = new RequirementsRequest(await request.save());
            let newRequests = requests;
            let oldRequestIndex = newRequests.findIndex(req => req.Id === updatedRequest.Id);
            if (oldRequestIndex > -1) {
                newRequests[oldRequestIndex] = updatedRequest;
            } else {
                newRequests.push(updatedRequest);
            }
            setRequests(newRequests);
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

    const submitApproval = async (request: IRequirementsRequestCRUD, comment: string) => {
        try {
            let approval = await requestApprovalsApi.submitApproval(request, comment);
            let newRequest = new RequirementsRequest(request);
            newRequest.PEOApprovedDateTime = approval.Created;
            newRequest.PEOApprovedComment = approval.Comment;
            let newRequests = requests;
            requests[newRequests.findIndex(req => req.Id === newRequest.Id)] = newRequest;
            setRequests(newRequests);
        } catch (e) {
            console.error("Error trying to approve Request");
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
                setError("Unknown error occurred while trying to approve Request!");
                throw new InternalError(new Error("Unknown error occurred while trying to approve Request!"));
            }
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
        submitApproval,
        deleteRequest
    });
}