import React from "react";
import { HashRouter, Route, Switch, useParams } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { RequestForm } from "../RequestForm/RequestForm";
import { RequestReview } from "../RequestReview/RequestReview";
import { Requests } from "../Requests/Requests";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    const [loading, requests, submitRequest, submitApproval, deleteRequest] = useRequests();
    const { requestId } = useParams();

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/Requests/new">
                    <RequestForm loading={loading} submitRequest={submitRequest} />
                </Route>
                <Route path="(/Requests/Edit/[0-9]+)">
                    <RequestForm loading={loading} submitRequest={submitRequest} editRequest={requests.find(req => req.Id === Number(requestId))} />
                </Route>
                <Route path="(/Requests/View/[0-9]+)">
                    <RequestReview loading={loading} request={requests.find(req => req.Id === Number(requestId))} />
                </Route>
                <Route path="(/Requests/Review/[0-9]+)">
                    <RequestReview loading={loading} request={requests.find(req => req.Id === Number(requestId))} submitApproval={submitApproval} />
                </Route>
                <Route path="/Requests">
                    <Requests loading={loading} requests={requests} deleteRequest={deleteRequest} />
                </Route>
            </Switch>
        </HashRouter>
    );
}