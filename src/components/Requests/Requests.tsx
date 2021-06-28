import React, { useContext, useState } from "react";
import { Accordion, Button, Col, Container, FormCheck, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApplicationTypes, getNextStatus, getStatusText, IRequirementsRequest, RequestStatuses } from "../../api/DomainObjects";
import { IRequests } from "../../hooks/useRequests";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import { RequestView } from "../RequestView/RequestView";
import { InfoTooltip } from "../InfoTooltip/InfoTooltip";
import { FilterField, SortIcon } from "./SortIcon";
import { Icon } from "@fluentui/react";

export interface IRequestsProps {
    requests: IRequests
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    const [, setRequestIdShown] = useState<number>(-1);

    const { user, roles } = useContext(UserContext);
    const [sort, setSort] = useState<{ field: FilterField, ascending: boolean }>();

    const userSwitchOnClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.requests.setFilters({ ...props.requests.filters, showAllUsers: !e.target.checked });
    }

    const sortIconOnClick = (field: FilterField) => {
        let newSort: { field: FilterField, ascending: boolean } | undefined = { field: field, ascending: true };
        if (sort?.field === field) {
            newSort = sort.ascending ? { field: field, ascending: false } : undefined;
        }
        setSort(newSort);
        props.requests.sortBy(newSort?.field, newSort?.ascending);
    }

    return (
        <Container fluid className="pb-5 pt-3">
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
            <Table bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th className="rrm-id-column">
                            <Row className="m-0">
                                <span>ID</span>
                                <SortIcon
                                    field="Id"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "Id"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th>
                            <Row className="m-0">
                                <span>Title</span>
                                <SortIcon
                                    field="Title"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "Title"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th>
                            <Row className="m-0">
                                <span>Requester</span>
                                <SortIcon
                                    field="Requester"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "Requester"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th className="rrm-width-md">
                            <Row className="m-0">
                                <span>Request Date</span>
                                <SortIcon
                                    field="RequestDate"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "RequestDate"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th className="rrm-width-md">
                            <Row className="m-0">
                                <span>Application</span>
                                <SortIcon
                                    field="ApplicationNeeded"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "ApplicationNeeded"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th className="rrm-width-md">
                            <Row className="m-0">
                                <span>Org Priority</span>
                                <SortIcon
                                    field="OrgPriority"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "OrgPriority"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th className="rrm-width-md">
                            <Row className="m-0">
                                <span>Op Need Date</span>
                                <SortIcon
                                    field="OperationalNeedDate"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "OperationalNeedDate"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                        <th>
                            <Row className="m-0">
                                <span>Status</span>
                                <SortIcon
                                    field="Status"
                                    ascending={sort?.ascending === true}
                                    active={sort?.field === "Status"}
                                    onClick={sortIconOnClick}
                                />
                            </Row>
                        </th>
                    </tr>
                </thead>
                <Accordion as='tbody'>
                    {props.requests.requestsList.map(request =>
                        <React.Fragment key={request.Id}>
                            <Accordion.Toggle onClick={() => setRequestIdShown(request.Id)} eventKey={request.Id.toString()} as='tr' role="button" className={RoleDefinitions.userCanChangeStatus(request, getNextStatus(request.Status), user, roles) ? "alert-row" : ""}>
                                <td>
                                    {RoleDefinitions.userCanChangeStatus(request, getNextStatus(request.Status), user, roles) &&
                                        <Link to={`/Requests/Review/${request.Id}`}>
                                            <InfoTooltip
                                                id={`${request.Id}_alert`}
                                                trigger={
                                                    <Icon
                                                        iconName='Info'
                                                        ariaLabel="Info"
                                                        className="mr-1 align-middle info-tooltip-icon alert-tooltip-icon"
                                                    />}>
                                                This Request is waiting on your Review! Click the icon to go to the Review page
                                            </InfoTooltip>
                                        </Link>}
                                    {request.getFormattedId()}
                                </td>
                                <td>{request.Title}</td>
                                <td>{request.Requester.Title}</td>
                                <td>{request.RequestDate.format("DD MMM YYYY")}</td>
                                <td>{request.ApplicationNeeded === ApplicationTypes.OTHER ?
                                    request.OtherApplicationNeeded : request.ApplicationNeeded}</td>
                                <td>{request.OrgPriority}</td>
                                <td>{request.OperationalNeedDate ? request.OperationalNeedDate.format("DD MMM YYYY") : "None"}</td>
                                <td>{request.Status} awaiting {getStatusText(getNextStatus(request.Status))}</td>
                            </Accordion.Toggle>
                            <tr key={"collapsible" + request.Id}>
                                <td colSpan={8} className="p-0">
                                    <Accordion.Collapse eventKey={request.Id.toString()}>
                                        <div className="p-1">
                                            <RequestView request={request} loadNotes={false} size="sm" />
                                            <Row className="m-2">
                                                {!request.isReadOnly(user, roles) &&
                                                    <Link className="ml-auto mr-2" to={`/Requests/Edit/${request.Id}`}>
                                                        <Button variant="warning">Edit Request</Button>
                                                    </Link>}
                                                {RoleDefinitions.userCanChangeStatus(request, getNextStatus(request.Status), user, roles) ?
                                                    <Link
                                                        className={request.isReadOnly(user, roles) ? "ml-auto" : ""}
                                                        to={`/Requests/Review/${request.Id}`}>
                                                        <Button variant="primary">Review Request</Button>
                                                    </Link> :
                                                    <Link
                                                        className={request.isReadOnly(user, roles) ? "ml-auto" : ""}
                                                        to={`/Requests/View/${request.Id}`}>
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