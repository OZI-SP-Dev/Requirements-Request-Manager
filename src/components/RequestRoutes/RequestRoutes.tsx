import React, { useContext } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { RequestForm } from "../RequestForm/RequestForm";
import { RequestReview } from "../RequestReview/RequestReview";
import { Requests } from "../Requests/Requests";
import RequestSpinner from "../RequestSpinner/RequestSpinner";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    const [loadingRequests, requests, submitRequest, submitApproval, deleteRequest] = useRequests();

    const { loadingUser } = useContext(UserContext);

    // Notes: Routing like this requires that loading any particular request means that we MUST load
    //    the entire Requests list first. This will be problematic if we ever move to paging.
    return (
        loadingRequests || loadingUser ?
            <RequestSpinner
                show={loadingRequests || loadingUser === undefined || loadingUser}
                displayText={loadingRequests ? "Loading Requests..." : "Loading User..."} /> :
            <HashRouter>
                <Switch>
                    <Route exact path="/Requests/New">
                        <RequestForm submitRequest={submitRequest} />
                    </Route>
                    <Route
                        path="/Requests/Edit/:requestId"
                        render={({ match }) => {
                            let request = requests.find(req => req.Id === Number(match.params.requestId));
                            return request ?
                                <RequestForm submitRequest={submitRequest} editRequest={request} /> :
                                <Redirect to="/Requests" />
                        }} />
                    <Route
                        path="/Requests/View/:requestId"
                        render={({ match }) => {
                            let request = requests.find(req => req.Id === Number(match.params.requestId));
                            return request ?
                                <RequestReview request={request} /> :
                                <Redirect to="/Requests" />
                        }} />
                    <Route
                        path="/Requests/Review/:requestId"
                        render={({ match }) => {
                            let request = requests.find(req => req.Id === Number(match.params.requestId));
                            return request ?
                                <RequestReview request={request} submitApproval={submitApproval} /> :
                                <Redirect to="/Requests" />
                        }} />
                    <Route exact path="/Requests">
                        <Requests requests={requests} deleteRequest={deleteRequest} />
                    </Route>
                    <Route path="*">
                        <Redirect to="/Requests" />
                    </Route>
                </Switch>
            </HashRouter>
    );
}