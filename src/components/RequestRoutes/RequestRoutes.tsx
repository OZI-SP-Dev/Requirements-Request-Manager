import React, { useState, useEffect } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { RequestForm } from "../RequestForm/RequestForm";
import { Requests } from "../Requests/Requests";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { RequirementsRequestsApiConfig, IRequirementsRequestApi } from "../../api/RequirementsRequestsApi";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

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

    return (
        <HashRouter>
            <Switch>
                <Route path="/Requests/new">
                    <RequestForm updateRequests={updateRequests} />
                </Route>
                <Route path="/Requests">
                    <Requests requests={requests} />
                </Route>
            </Switch>
        </HashRouter>
    );
}