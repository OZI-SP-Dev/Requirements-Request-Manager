import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "../api/RequestApprovalsApi";


export function useRequests(): [IRequirementsRequestCRUD[],
    (request: IRequirementsRequestCRUD) => Promise<void>,
    (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    (request: IRequirementsRequestCRUD) => Promise<void>] {

    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);

    const requirementsRequestApi: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();
    const requestApprovalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();

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
        setRequests(await requirementsRequestApi.fetchRequirementsRequests())
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, []);

    return ([requests, submitRequest, submitApproval, deleteRequest]);
}