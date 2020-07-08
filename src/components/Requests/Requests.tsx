import React from "react";
import { Button, Container, Table, Accordion, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IRequirementsRequestCRUD, ApplicationTypes } from "../../api/DomainObjects";

export interface IRequestsProps {
    requests: IRequirementsRequestCRUD[]
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

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
                                <td>{request.PEOApprovedDate ? request.PEOApprovedDate.format("DD MMM YYYY") : "None"}</td>
                            </Accordion.Toggle>
                            <tr key={"collapsible" + request.Id}>
                                <td colSpan={7} className="p-0">
                                    <Accordion.Collapse eventKey={request.Id.toString()}>
                                        <div className="p-1">
                                            <Row className="ml-2 mr-2 mt-2" style={{ textAlign: "left" }}>
                                                <Col className="mt-2" xl={4} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Request Title: </strong>
                                                    {request.Title}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Request Date: </strong>
                                                    {request.RequestDate.format("DD MMM YYYY")}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={8} md={6} sm={6} xs={12}>
                                                    <strong>Recieved Date: </strong>
                                                    {request.ReceivedDate.format("DD MMM YYYY")}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={6} md={6} sm={12} xs={12}>
                                                    <strong>Requester: </strong>
                                                    {request.Requester.Title}
                                                </Col>
                                                <Col className="mt-2" xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <strong>Requester Email: </strong>
                                                    {request.Requester.EMail}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <strong>Requester Org: </strong>
                                                    {request.RequesterOrgSymbol}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>Requester Comm #: </strong>
                                                    {request.RequesterCommPhone}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>Requester DSN #: </strong>
                                                    {request.RequesterDSNPhone}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={6} md={6} sm={12} xs={12}>
                                                    <strong>Approving PEO: </strong>
                                                    {request.ApprovingPEO.Title}
                                                </Col>
                                                <Col className="mt-2" xl={6} lg={6} md={6} sm={12} xs={12}>
                                                    <strong>PEO Email: </strong>
                                                    {request.ApprovingPEO.EMail}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <strong>PEO Org: </strong>
                                                    {request.PEOOrgSymbol}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>PEO Comm #: </strong>
                                                    {request.PEO_CommPhone}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>PEO DSN #: </strong>
                                                    {request.PEO_DSNPhone}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>Requirement Type: </strong>
                                                    {request.RequirementType}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>Funding Org: </strong>
                                                    {request.FundingOrgOrPEO ? request.FundingOrgOrPEO : "Not Funded"}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                                                    <strong>Application Needed: </strong>
                                                    {request.ApplicationNeeded === ApplicationTypes.OTHER ?
                                                        request.OtherApplicationNeeded : request.ApplicationNeeded}
                                                </Col>
                                            </Row>
                                            <Row className="ml-2 mr-2 mb-2" style={{ textAlign: "left" }}>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Projected Organizations Impacted: </strong>
                                                </Col>
                                                <Col className="mt-2" xl={2} lg={2} md={6} sm={6} xs={12}>
                                                    <strong>Is Enterprise?: </strong>
                                                    {request.IsProjectedOrgsEnterprise ? "Yes" : "No"}
                                                </Col>
                                                <Col className="mt-2" xl={2} lg={2} md={6} sm={6} xs={12}>
                                                    <strong>Center: </strong>
                                                    {request.ProjectedOrgsImpactedCenter}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Organization: </strong>
                                                    {request.ProjectedOrgsImpactedOrg}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Projected Number of Impacted Users: </strong>
                                                    {request.ProjectedImpactedUsers}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Operational Need Date: </strong>
                                                    {request.OperationalNeedDate.format("DD MMM YYYY")}
                                                </Col>
                                                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                                                    <strong>Organization's' Priority: </strong>
                                                    {request.OrgPriority}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Priority Explanation: </strong>
                                                    {request.PriorityExplanation}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Business Objective: </strong>
                                                    {request.BusinessObjective}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Functional Requirements: </strong>
                                                    {request.FunctionalRequirements}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Benefits: </strong>
                                                    {request.Benefits}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Risks: </strong>
                                                    {request.Risk}
                                                </Col>
                                                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                                                    <strong>Additional Information: </strong>
                                                    {request.AdditionalInfo ? request.AdditionalInfo : "None"}
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
        </Container>
    );
}