import React, { useContext } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { DismissableErrorAlert } from "../DismissableErrorAlert/DismissableErrorAlert";
import { RequestForm } from "../RequestForm/RequestForm";
import { RequestReview } from "../RequestReview/RequestReview";
import { Requests } from "../Requests/Requests";
import RequestSpinner from "../RequestSpinner/RequestSpinner";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    const requests = useRequests();

    const { loadingUser } = useContext(UserContext);

    return (
        <>
            <HashRouter>
                <Switch>
                    <Route exact path="/Requests/New">
                        <RequestForm submitRequest={requests.submitRequest} />
                    </Route>
                    <Route
                        path="/Requests/Edit/:requestId"
                        render={({ match }) =>
                            <RequestForm
                                fetchRequestById={requests.fetchRequestById}
                                submitRequest={requests.submitRequest}
                                editRequestId={Number(match.params.requestId)} />}
                    />
                    <Route
                        path="/Requests/View/:requestId"
                        render={({ match }) =>
                            <RequestReview
                                fetchRequestById={requests.fetchRequestById}
                                requestId={Number(match.params.requestId)} />}
                    />
                    <Route
                        path="/Requests/Review/:requestId"
                        render={({ match }) =>
                            <RequestReview
                                fetchRequestById={requests.fetchRequestById}
                                submitApproval={requests.submitApproval}
                                requestId={Number(match.params.requestId)} />}
                    />
                    <Route exact path="/Requests">
                        <Requests requests={requests} />
                    </Route>
                    <Route path="*">
                        <Redirect to="/Requests" />
                    </Route>
                </Switch>
            </HashRouter>
            <RequestSpinner
                show={requests.loading || loadingUser === undefined || loadingUser}
                displayText={requests.loading ? "Loading Requests..." : "Loading User..."} />
            <DismissableErrorAlert
                show={requests.error !== undefined && requests.error !== ""}
                header="Error!"
                message={requests.error}
                onClose={requests.clearError}
            />
        </>
    );
}