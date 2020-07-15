import React, { FunctionComponent, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { ApplicationTypes, IRequirementsRequestCRUD, IRequirementsRequest, RequirementsRequest } from "../../api/DomainObjects";
import "./RequestView.css"

export interface IRequestViewProps {
    request?: IRequirementsRequestCRUD
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(props.request ? props.request : new RequirementsRequest());

    useEffect(() => {
        setRequest(props.request ? props.request : new RequirementsRequest());
    }, [props.request])

    return (
        <>
            <Row className="ml-2 mr-2 mt-2 view-form">
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
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Approval Date: </strong>
                    {request.PEOApprovedDateTime ? request.PEOApprovedDateTime.format("DD MMM YYYY [at] HH:mm") : "Not Yet approved"}
                </Col>
                <Col className="mt-2" xl={8} lg={8} md={8} sm={6} xs={12}>
                    <strong>Comment on Approval: </strong>
                    {request.PEOApprovedComment ? request.PEOApprovedComment : "None"}
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
            <Row className="ml-2 mr-2 mb-2 view-form">
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
                    <p className="preserve-whitespace">{request.PriorityExplanation}</p>
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Business Objective: </strong>
                    <p className="preserve-whitespace">{request.BusinessObjective}</p>
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Functional Requirements: </strong>
                    <p className="preserve-whitespace">{request.FunctionalRequirements}</p>
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Benefits: </strong>
                    <p className="preserve-whitespace">{request.Benefits}</p>
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Risks: </strong>
                    <p className="preserve-whitespace">{request.Risk}</p>
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Additional Information: </strong>
                    <p className="preserve-whitespace">
                        {request.AdditionalInfo ? request.AdditionalInfo : "None"}
                    </p>
                </Col>
            </Row>
        </>
    )

}