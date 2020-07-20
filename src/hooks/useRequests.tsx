import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";


export function useRequests(): [boolean, IRequirementsRequestCRUD[],
    (request: IRequirementsRequestCRUD) => Promise<void>,
    (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    (request: IRequirementsRequestCRUD) => Promise<void>] {

    const [loading, setLoading] = useState<boolean>(true);
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);

    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();

    const submitRequest = async (request: IRequirementsRequestCRUD) => {
        setLoading(true);
        let updatedRequest = new RequirementsRequest(await request.save());
        let newRequests = requests;
        let oldRequestIndex = newRequests.findIndex(req => req.Id === updatedRequest.Id);
        if (oldRequestIndex > -1) {
            newRequests[oldRequestIndex] = updatedRequest;
        } else {
            newRequests.push(updatedRequest);
        }
        setRequests(newRequests);
        setLoading(false);
    }

    const submitApproval = async (request: IRequirementsRequestCRUD, comment: string) => {
        setLoading(true);
        let approval = await requestApprovalsApi.submitApproval(request, comment);
        let newRequest = new RequirementsRequest(request);
        newRequest.PEOApprovedDateTime = approval.Created;
        newRequest.PEOApprovedComment = approval.Comment;
        let newRequests = requests;
        requests[newRequests.findIndex(req => req.Id === newRequest.Id)] = newRequest;
        setRequests(newRequests);
        setLoading(false);
    }

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        setLoading(true);
        await request.delete();
        setRequests(requests.filter(req => req.Id !== request.Id));
        setLoading(false);
    }

    const fetchRequests = async () => {
        setLoading(true);
        setRequests(await requirementsRequestApi.fetchRequirementsRequests());
        setLoading(false);
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, []);

    return ([loading, requests, submitRequest, submitApproval, deleteRequest]);
}