import React, { useState, useContext } from "react";
import { Button, Container, Table, Accordion, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IRequirementsRequestCRUD, ApplicationTypes } from "../../api/DomainObjects";
import { RequestView } from "../RequestView/RequestView";
import { UserContext } from "../../providers/UserProvider";
import RequestSpinner from "../RequestSpinner/RequestSpinner";

export interface IRequestsProps {
    loading: boolean,
    requests: IRequirementsRequestCRUD[],
    deleteRequest: (request: IRequirementsRequestCRUD) => Promise<void>
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    const [deleting, setDeleting] = useState<boolean>(false);

    const { user } = useContext(UserContext);

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        setDeleting(true);
        await props.deleteRequest(request);
        setDeleting(false);
    }

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>Requests</h1>
            <Row className="mr-1 mb-3 float-right">
                <Link to="/Requests/new">
                    <Button variant="primary">New Request</Button>
                </Link>
            </Row>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Requester</th>
                        <th>Request Date</th>
                        <th>Application Needed</th>
                        <th>Org Priority</th>
                        <th>Operational Need Date</th>
                        <th>Approval</th>
                    </tr>
                </thead>
                <Accordion as='tbody'>
                    {props.requests.map(request =>
                        <>
                            <Accordion.Toggle key={request.Id} eventKey={request.Id.toString()} as='tr' role="button">
                                <td>{request.Title}</td>
                                <td>{request.Requester.Title}</td>
                                <td>{request.RequestDate.format("DD MMM YYYY")}</td>
                                <td>{request.ApplicationNeeded === ApplicationTypes.OTHER ?
                                    request.OtherApplicationNeeded : request.ApplicationNeeded}</td>
                                <td>{request.OrgPriority}</td>
                                <td>{request.OperationalNeedDate.format("DD MMM YYYY")}</td>
                                <td>{request.PEOApprovedDateTime ? request.PEOApprovedDateTime.format("DD MMM YYYY") : "None"}</td>
                            </Accordion.Toggle>
                            <tr key={"collapsible" + request.Id}>
                                <td colSpan={7} className="p-0">
                                    <Accordion.Collapse eventKey={request.Id.toString()}>
                                        <div className="p-1">
                                            <RequestView request={request} />
                                            <Row className="ml-2 mr-2">
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <Button className="float-left" variant="danger"
                                                        onClick={async () => deleteRequest(request)}
                                                    >
                                                        {deleting &&
                                                            <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                                                        {' '}{"Delete Request"}
                                                    </Button>
                                                    <Link to={`/Requests/Edit/${request.Id}`}>
                                                        <Button className="float-left ml-2" variant="warning">Edit Request</Button>
                                                    </Link>
                                                    {request.PEOApprovedDateTime || user?.Id !== request.ApprovingPEO.Id ?
                                                        <Link to={`/Requests/View/${request.Id}`}>
                                                            <Button className="float-right" variant="primary">View Request</Button>
                                                        </Link>
                                                        : <Link to={`/Requests/Review/${request.Id}`}>
                                                            <Button className="float-right" variant="primary">Review Request</Button>
                                                        </Link>
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    </Accordion.Collapse>
                                </td>
                            </tr>
                        </>
                    )}
                </Accordion>
            </Table>
            <RequestSpinner show={props.loading || !user} />
        </Container>
    );
}