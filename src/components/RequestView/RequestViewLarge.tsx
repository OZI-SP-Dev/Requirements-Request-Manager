import React, { FunctionComponent } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { ApplicationTypes } from "../../api/DomainObjects";
import { NoteCard } from "../NoteCard/NoteCard";
import { IRequestViewChildProps } from "./RequestView";

export const RequestViewLarge: FunctionComponent<IRequestViewChildProps> = (props) => {

    const notesEmpty = props.notes.notes.length === 0;

    const getColSize = (displaySize: "xl" | "lg" | "md" | "sm" | "xs") => {
        if (displaySize === "xl" || displaySize === "lg") {
            if (!notesEmpty) {
                return 8;
            } else if (props.notesEditable) {
                return 10;
            } else {
                return 12;
            }
        } else {
            return 12;
        }
    }

    return (
        <Row>
            <Col xl={getColSize("xl")} lg={getColSize("lg")} md={getColSize("md")} sm={getColSize("sm")} xs={getColSize("xs")}>
                <Row className="ml-2 mr-2 mt-2 view-form">
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
                        {props.request.ReceivedDate ? props.request.ReceivedDate.format("DD MMM YYYY") : "None"}
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
                        {props.request.RequesterDSNPhone ? props.request.RequesterDSNPhone : "None"}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                        <strong>Approval Date: </strong>
                        {props.request.PEOApprovedDateTime ? props.request.PEOApprovedDateTime.format("DD MMM YYYY [at] HH:mm") : "Not Yet approved"}
                    </Col>
                    <Col className="mt-2" xl={8} lg={8} md={8} sm={6} xs={12}>
                        <strong>Comment on Approval: </strong>
                        {props.request.PEOApprovedComment ? props.request.PEOApprovedComment : "None"}
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
                        {props.request.PEO_DSNPhone ? props.request.PEO_DSNPhone : "None"}
                    </Col>
                </Row>
                <hr className="m-3" />
                <Row className="ml-2 mr-2 mb-2 view-form">
                    <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                        <strong>Requirement Type: </strong>
                        {props.request.NoveltyRequirementType}, {props.request.FuncRequirementType}
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
                <Row className="ml-2 mr-2 mb-2 view-form">
                    <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                        <strong>Projected Organizations Impacted: </strong>
                    </Col>
                    <Col className="mt-2" xl={2} lg={2} md={6} sm={6} xs={12}>
                        <strong>Enterprise: </strong>
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
                        {props.request.ProjectedImpactedUsers === null ? "Unknown" : props.request.ProjectedImpactedUsers}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                        <strong>Operational Need Date: </strong>
                        {props.request.OperationalNeedDate.format("DD MMM YYYY")}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={6} sm={6} xs={12}>
                        <strong>Organization's' Priority: </strong>
                        {props.request.OrgPriority}
                    </Col>
                </Row>
                <hr className="m-3" />
                <Row className="ml-2 mr-2 mb-2 view-form">
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Priority Explanation: </strong>
                        <p className="preserve-whitespace">{props.request.PriorityExplanation}</p>
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Business Objective: </strong>
                        <p className="preserve-whitespace">{props.request.BusinessObjective}</p>
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Functional Requirements: </strong>
                        <p className="preserve-whitespace">{props.request.FunctionalRequirements}</p>
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Benefits: </strong>
                        <p className="preserve-whitespace">{props.request.Benefits}</p>
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Risks: </strong>
                        <p className="preserve-whitespace">{props.request.Risk}</p>
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Additional Information: </strong>
                        <p className="preserve-whitespace">
                            {props.request.AdditionalInfo ? props.request.AdditionalInfo : "None"}
                        </p>
                    </Col>
                </Row>
            </Col>
            {(!notesEmpty || props.notesEditable) && // don't have column if there's nothing to display
                <Col xl={notesEmpty ? "2" : "4"} lg={notesEmpty ? "2" : "4"} md="12" sm="12" xs="12">
                    {props.notesEditable &&
                        <Row>
                            <Col>
                                <Button className="notes-button m-3 float-right" onClick={() => props.editNoteOnClick()}>New Note</Button>
                            </Col>
                        </Row>
                    }
                    <Card className="notes-card">
                        {props.notes.notes.map(note =>
                            <Col key={note.Id} className="mt-3 mb-3">
                                <NoteCard
                                    note={note}
                                    editable={props.notesEditable}
                                    editOnClick={() => props.editNoteOnClick(note)}
                                    deleteNote={props.notes.deleteNote} />
                            </Col>
                        )}
                    </Card>
                </Col>}
        </Row>
    )

}