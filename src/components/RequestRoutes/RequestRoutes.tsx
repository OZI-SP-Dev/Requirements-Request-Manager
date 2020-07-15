import React from "react";
import { HashRouter, Route, Switch, useParams } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { RequestForm } from "../RequestForm/RequestForm";
import { RequestReview } from "../RequestReview/RequestReview";
import { Requests } from "../Requests/Requests";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    const [requests, submitRequest, submitApproval, deleteRequest] = useRequests();
    const { requestId } = useParams();

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/Requests">
                    <Requests requests={requests} deleteRequest={deleteRequest} />
                </Route>
                <Route exact path="/Requests/new">
                    <RequestForm submitRequest={submitRequest} />
                </Route>
                <Route path="(/Requests/Edit/[0-9]+)">
                    <RequestForm submitRequest={submitRequest} editRequest={requests.find(req => req.Id === Number(requestId))} />
                </Route>
                <Route path="(/Requests/View/[0-9]+)">
                    <RequestReview request={requests.find(req => req.Id === Number(requestId))} />
                </Route>
                <Route path="(/Requests/Review/[0-9]+)">
                    <RequestReview request={requests.find(req => req.Id === Number(requestId))} submitApproval={submitApproval} />
                </Route>
            </Switch>
        </HashRouter>
    );
}