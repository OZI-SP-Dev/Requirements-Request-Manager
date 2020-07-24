import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";
import { IUserApi, UserApiConfig } from "../api/UserApi";

export interface IRequestFilters {
    showAllUsers: boolean
}

export interface IRequests {
    loading: boolean,
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
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const [filters, setFilters] = useState<IRequestFilters>({ showAllUsers: false });

    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();
    const userApi: IUserApi = UserApiConfig.getApi();

    const submitRequest = async (request: IRequirementsRequestCRUD) => {
        let updatedRequest = new RequirementsRequest(await request.save());
        let newRequests = requests;
        let oldRequestIndex = newRequests.findIndex(req => req.Id === updatedRequest.Id);
        if (oldRequestIndex > -1) {
            newRequests[oldRequestIndex] = updatedRequest;
        } else {
            newRequests.push(updatedRequest);
        }
        setRequests(newRequests);
    }

    const submitApproval = async (request: IRequirementsRequestCRUD, comment: string) => {
        let approval = await requestApprovalsApi.submitApproval(request, comment);
        let newRequest = new RequirementsRequest(request);
        newRequest.PEOApprovedDateTime = approval.Created;
        newRequest.PEOApprovedComment = approval.Comment;
        let newRequests = requests;
        requests[newRequests.findIndex(req => req.Id === newRequest.Id)] = newRequest;
        setRequests(newRequests);
    }

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        await request.delete();
        setRequests(requests.filter(req => req.Id !== request.Id));
    }

    const fetchRequests = async () => {
        setLoading(true);
        setRequests(await requirementsRequestApi.fetchRequirementsRequests(
            filters.showAllUsers ? undefined : (await userApi.getCurrentUser()).Id));
        setLoading(false);
    }

    const fetchRequestById = async (requestId: number): Promise<IRequirementsRequestCRUD | undefined> => {
        setLoading(true);
        let request = requests.find(req => req.Id === requestId);
        if (!request) {
            request = await requirementsRequestApi.fetchRequirementsRequestById(requestId);
        }
        setLoading(false);
        return request;
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, [filters]);

    return ({ loading, requestsList: requests, filters, setFilters, fetchRequestById, submitRequest, submitApproval, deleteRequest });
}