import React, { useContext, useState } from "react";
import { Accordion, Button, Col, Container, FormCheck, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApplicationTypes, getNextStatus } from "../../api/DomainObjects";
import { IRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import { RequestView } from "../RequestView/RequestView";

export interface IRequestsProps {
    requests: IRequests
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    const [requestIdShown, setRequestIdShown] = useState<number>(-1);

    const { user, roles } = useContext(UserContext);

    const userSwitchOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.requests.setFilters({ ...props.requests.filters, showAllUsers: !e.target.checked });
    }

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>Requests</h1>
            <Row className="mr-1 ml-1 mb-3">
                <Col className="align-self-center">
                    <FormCheck
                        id="userCheck"
                        className="float-left"
                        type="switch"
                        label="My Requests Only"
                        checked={!props.requests.filters.showAllUsers}
                        onChange={userSwitchOnClick}
                    />
                </Col>
                <Col>
                    <Link to="/Requests/New">
                        <Button variant="primary" className="float-right">New Request</Button>
                    </Link>
                </Col>
            </Row>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Requester</th>
                        <th>Request Date</th>
                        <th>Application Needed</th>
                        <th>Org Priority</th>
                        <th>Operational Need Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <Accordion as='tbody'>
                    {props.requests.requestsList.map(request =>
                        <React.Fragment key={request.Id}>
                            <Accordion.Toggle onClick={() => setRequestIdShown(request.Id)} eventKey={request.Id.toString()} as='tr' role="button">
                                <td>{request.getFormattedId()}</td>
                                <td>{request.Title}</td>
                                <td>{request.Requester.Title}</td>
                                <td>{request.RequestDate.format("DD MMM YYYY")}</td>
                                <td>{request.ApplicationNeeded === ApplicationTypes.OTHER ?
                                    request.OtherApplicationNeeded : request.ApplicationNeeded}</td>
                                <td>{request.OrgPriority}</td>
                                <td>{request.OperationalNeedDate.format("DD MMM YYYY")}</td>
                                <td>{request.Status} on {request.StatusDateTime.format("DD MMM YYYY")}</td>
                            </Accordion.Toggle>
                            <tr key={"collapsible" + request.Id}>
                                <td colSpan={8} className="p-0">
                                    <Accordion.Collapse eventKey={request.Id.toString()}>
                                        <div className="p-1">
                                            <RequestView request={request} loadNotes={requestIdShown === request.Id} size="sm" />
                                            <Row className="ml-2 mr-2">
                                                {!request.isReadOnly(user, roles) &&
                                                    <Link className="ml-auto mr-2" to={`/Requests/Edit/${request.Id}`}>
                                                        <Button variant="warning">Edit Request</Button>
                                                    </Link>}
                                                {RoleDefinitions.userCanChangeStatus(request, getNextStatus(request), user, roles) ?
                                                    <Link className={request.isReadOnly(user, roles) ? "ml-auto" : ""} to={`/Requests/Review/${request.Id}`}>
                                                        <Button variant="primary">Review Request</Button>
                                                    </Link> :
                                                    <Link className="ml-auto" to={`/Requests/View/${request.Id}`}>
                                                        <Button variant="primary">View Request</Button>
                                                    </Link>
                                                }
                                            </Row>
                                        </div>
                                    </Accordion.Collapse>
                                </td>
                            </tr>
                        </React.Fragment>
                    )}
                </Accordion>
            </Table>
            {!props.requests.loading && props.requests.requestsList.length === 0 && <h5 className="text-center">There were no Requests found</h5>}
        </Container>
    );
}