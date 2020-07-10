import React, { FunctionComponent } from "react";
import { Col, Row } from "react-bootstrap";
import { ApplicationTypes, IRequirementsRequestCRUD } from "../../api/DomainObjects";

export interface IRequestViewProps {
    request: IRequirementsRequestCRUD
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    return (
        <>
            <Row className="ml-2 mr-2 mt-2" style={{ textAlign: "left" }}>
                <Col className="mt-2" xl={4} lg={12} md={12} sm={12} xs={12}>
                    <strong>Request Title: </strong>
                    {props.request.Title}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Request Date: </strong>
                    {props.request.RequestDate.format("DD MMM YYYY")}
                </Col>
                <Col className="mt-2" xl={4} lg={8} md={6} sm={6} xs={12}>
                    <strong>Recieved Date: </strong>
                    {props.request.ReceivedDate.format("DD MMM YYYY")}
                </Col>
                <Col className="mt-2" xl={4} lg={6} md={6} sm={12} xs={12}>
                    <strong>Requester: </strong>
                    {props.request.Requester.Title}
                </Col>
                <Col className="mt-2" xl={6} lg={6} md={6} sm={12} xs={12}>
                    <strong>Requester Email: </strong>
                    {props.request.Requester.EMail}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={12} xs={12}>
                    <strong>Requester Org: </strong>
                    {props.request.RequesterOrgSymbol}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Requester Comm #: </strong>
                    {props.request.RequesterCommPhone}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Requester DSN #: </strong>
                    {props.request.RequesterDSNPhone}
                </Col>
                <Col className="mt-2" xl={4} lg={6} md={6} sm={12} xs={12}>
                    <strong>Approving PEO: </strong>
                    {props.request.ApprovingPEO.Title}
                </Col>
                <Col className="mt-2" xl={6} lg={6} md={6} sm={12} xs={12}>
                    <strong>PEO Email: </strong>
                    {props.request.ApprovingPEO.EMail}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={12} xs={12}>
                    <strong>PEO Org: </strong>
                    {props.request.PEOOrgSymbol}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>PEO Comm #: </strong>
                    {props.request.PEO_CommPhone}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>PEO DSN #: </strong>
                    {props.request.PEO_DSNPhone}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Requirement Type: </strong>
                    {props.request.RequirementType}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Funding Org: </strong>
                    {props.request.FundingOrgOrPEO ? props.request.FundingOrgOrPEO : "Not Funded"}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                    <strong>Application Needed: </strong>
                    {props.request.ApplicationNeeded === ApplicationTypes.OTHER ?
                        props.request.OtherApplicationNeeded : props.request.ApplicationNeeded}
                </Col>
            </Row>
            <Row className="ml-2 mr-2 mb-2" style={{ textAlign: "left" }}>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Projected Organizations Impacted: </strong>
                </Col>
                <Col className="mt-2" xl={2} lg={2} md={6} sm={6} xs={12}>
                    <strong>Is Enterprise?: </strong>
                    {props.request.IsProjectedOrgsEnterprise ? "Yes" : "No"}
                </Col>
                <Col className="mt-2" xl={2} lg={2} md={6} sm={6} xs={12}>
                    <strong>Center: </strong>
                    {props.request.ProjectedOrgsImpactedCenter}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Organization: </strong>
                    {props.request.ProjectedOrgsImpactedOrg}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Projected Number of Impacted Users: </strong>
                    {props.request.ProjectedImpactedUsers}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Operational Need Date: </strong>
                    {props.request.OperationalNeedDate.format("DD MMM YYYY")}
                </Col>
                <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                    <strong>Organization's' Priority: </strong>
                    {props.request.OrgPriority}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Priority Explanation: </strong>
                    {props.request.PriorityExplanation}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Business Objective: </strong>
                    {props.request.BusinessObjective}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Functional Requirements: </strong>
                    {props.request.FunctionalRequirements}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Benefits: </strong>
                    {props.request.Benefits}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Risks: </strong>
                    {props.request.Risk}
                </Col>
                <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <strong>Additional Information: </strong>
                    {props.request.AdditionalInfo ? props.request.AdditionalInfo : "None"}
                </Col>
            </Row>
        </>
    )

}