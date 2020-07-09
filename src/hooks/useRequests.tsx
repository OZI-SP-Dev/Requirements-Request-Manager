import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";


export function useRequests(): [IRequirementsRequestCRUD[],
    (request: IRequirementsRequestCRUD) => Promise<void>,
    (request: IRequirementsRequestCRUD) => Promise<void>] {

    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const api: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();

    const submitRequest = async (request: IRequirementsRequestCRUD) => {
        let updatedRequest = await api.submitRequirementsRequest(request);
        let newRequests = requests;
        let oldRequestIndex = newRequests.findIndex(req => req.Id === updatedRequest.Id);
        if (oldRequestIndex > -1) {
            newRequests[oldRequestIndex] = updatedRequest;
        } else {
            newRequests.push(updatedRequest);
        }
        setRequests(newRequests);
    }

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        await api.deleteRequirementsRequest(request);
        setRequests(requests.filter(req => req.Id !== request.Id));
    }

    const fetchRequests = async () => {
        setRequests(await api.fetchRequirementsRequests())
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, []);

    return ([requests, submitRequest, deleteRequest]);
}