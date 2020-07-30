import React, { useContext } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { RequestForm } from "../RequestForm/RequestForm";
import { RequestReview } from "../RequestReview/RequestReview";
import { Requests } from "../Requests/Requests";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { Alert, Row, Col } from "react-bootstrap";
import './RequestRoutes.css'


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
                        <Requests requests={requests} deleteRequest={requests.deleteRequest} />
                    </Route>
                    <Route path="*">
                        <Redirect to="/Requests" />
                    </Route>
                </Switch>
            </HashRouter>
            <RequestSpinner
                show={requests.loading || loadingUser === undefined || loadingUser}
                displayText={requests.loading ? "Loading Requests..." : "Loading User..."} />
            {requests.error &&
                <Col className="fixed-bottom"
                    xl={{ span: 6, offset: 3 }}
                    lg={{ span: 6, offset: 3 }}
                    md={{ span: 8, offset: 2 }}
                    sm={{ span: 10, offset: 1 }}
                    xs={12}
                >
                    <Alert variant="danger" onClose={() => requests.clearError()} dismissible>
                        <Alert.Heading>Error!</Alert.Heading>
                        <p>{requests.error}</p>
                    </Alert>
                </Col>
            }
        </>
    );
}