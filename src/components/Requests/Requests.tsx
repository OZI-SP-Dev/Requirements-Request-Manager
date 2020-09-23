import React, { useContext, useState } from "react";
import { Accordion, Button, Col, Container, FormCheck, Row, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApplicationTypes, IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { IRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { ConfirmPopover } from "../ConfirmPopover/ConfirmPopover";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { RequestView } from "../RequestView/RequestView";

export interface IRequestsProps {
    requests: IRequests
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    const [deleting, setDeleting] = useState<boolean>(false);
    const [requestIdShown, setRequestIdShown] = useState<number>(-1);
    const [showDeletePopover, setShowDeletePopover] = useState<boolean>(false);
    const [deletePopoverTarget, setDeletePopoverTarget] = useState<any>();

    const { user, roles } = useContext(UserContext);

    const userSwitchOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.requests.setFilters({ ...props.requests.filters, showAllUsers: !e.target.checked });
    }

    const deleteRequest = async (request: IRequirementsRequestCRUD) => {
        try {
            setDeleting(true);
            await props.requests.deleteRequest(request);
        } finally {
            setDeleting(false);
        }
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
                        <th>Approval</th>
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
                                <td>{request.PEOApprovedDateTime ? request.PEOApprovedDateTime.format("DD MMM YYYY") : "None"}</td>
                            </Accordion.Toggle>
                            <tr key={"collapsible" + request.Id}>
                                <td colSpan={8} className="p-0">
                                    <Accordion.Collapse eventKey={request.Id.toString()}>
                                        <div className="p-1">
                                            <RequestView request={request} loadNotes={requestIdShown === request.Id} size="sm" />
                                            <Row className="ml-2 mr-2">
                                                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    {!request.isReadOnly(user, roles) &&
                                                        <>
                                                            <ConfirmPopover
                                                                show={showDeletePopover}
                                                                target={deletePopoverTarget}
                                                                variant="danger"
                                                                titleText="Delete Request"
                                                                confirmationText="Are you sure you want to delete this request?"
                                                                onSubmit={async () => deleteRequest(request)}
                                                                handleClose={() => setShowDeletePopover(false)}
                                                            />
                                                            <Button className="float-left" variant="danger"
                                                                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                                    setDeletePopoverTarget(event.target);
                                                                    setShowDeletePopover(true);
                                                                }}
                                                            >
                                                                {deleting &&
                                                                    <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                                                                {' '}{"Delete Request"}
                                                            </Button>
                                                        </>}
                                                    {!request.isReadOnly(user, roles) &&
                                                        <Link to={`/Requests/Edit/${request.Id}`}>
                                                            <Button className="float-left ml-2" variant="warning">Edit Request</Button>
                                                        </Link>}
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
                        </React.Fragment>
                    )}
                </Accordion>
            </Table>
            {!props.requests.loading && props.requests.requestsList.length === 0 && <h5 className="text-center">There were no Requests found</h5>}
            <RequestSpinner show={deleting} displayText="Deleting Request..." />
        </Container>
    );
}