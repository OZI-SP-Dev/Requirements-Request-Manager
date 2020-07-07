import { useEffect, useState } from "react";
import { IRequirementsRequestCRUD } from "../api/DomainObjects";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../api/RequirementsRequestsApi";


export function useRequests(): [IRequirementsRequestCRUD[], (request: IRequirementsRequestCRUD) => void] {
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const api: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();

    const updateRequests = (request: IRequirementsRequestCRUD) => {
        let newRequests = requests;
        let oldRequestIndex = newRequests.findIndex(req => req.Id === request.Id);
        if (oldRequestIndex > -1) {
            newRequests[oldRequestIndex] = request;
        } else {
            newRequests.push(request);
        }
        setRequests(newRequests);
    }

    const fetchRequests = async () => {
        setRequests(await api.fetchRequirementsRequests())
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, []);

    return ([requests, updateRequests]);
}