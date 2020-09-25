import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import React, { FunctionComponent } from "react";
import { Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { NoteCard } from "../NoteCard/NoteCard";
import { IRequestViewChildProps } from "./RequestView";

export const RequestViewSmall: FunctionComponent<IRequestViewChildProps> = (props) => {

    let requesterPopover =
        <Popover id={`popover-${props.request.Requester.EMail}`}>
            <Popover.Title as="h3">{props.request.Requester.Title}</Popover.Title>
            <Popover.Content>
                <strong>Email:</strong> {props.request.Requester.EMail}<br />
                <strong>Org:</strong> {props.request.RequesterOrgSymbol}<br />
                <strong>Comm #:</strong> {props.request.RequesterCommPhone}<br />
                <strong>DSN #:</strong> {props.request.RequesterDSNPhone}
            </Popover.Content>
        </Popover>;

    let approverPopover =
        <Popover id={`popover-${props.request.ApprovingPEO.EMail}`}>
            <Popover.Title as="h3">{props.request.ApprovingPEO.Title}</Popover.Title>
            <Popover.Content>
                <strong>Email:</strong> {props.request.ApprovingPEO.EMail}<br />
                <strong>Org:</strong> {props.request.PEOOrgSymbol}<br />
                <strong>Comm #:</strong> {props.request.PEO_CommPhone}<br />
                <strong>DSN #:</strong> {props.request.PEO_DSNPhone}
            </Popover.Content>
        </Popover>;

    return (
        <Row>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row className="ml-2 mr-2 mt-2 view-form">
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Recieved Date: </strong>
                        {props.request.ReceivedDate ? props.request.ReceivedDate.format("DD MMM YYYY") : "None"}
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Requester: </strong>
                        <OverlayTrigger trigger="click" placement="right" overlay={requesterPopover}>
                            <Persona className="clickable mr-2 d-none d-inline-block" {...props.request.Requester} hidePersonaDetails size={PersonaSize.size32} />
                        </OverlayTrigger>
                        {props.request.Requester.Title}
                    </Col>
                    <Col className="mt-2" xl={12} lg={12} md={12} sm={12} xs={12}>
                        <strong>Approving PEO/2 Ltr: </strong>
                        <OverlayTrigger trigger="click" placement="right" overlay={approverPopover}>
                            <Persona
                                className="clickable mr-2 d-none d-inline-block"
                                {...props.request.ApprovingPEO}
                                hidePersonaDetails
                                size={PersonaSize.size32}
                            />
                        </OverlayTrigger>
                        {props.request.ApprovingPEO.Title}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                        <strong>Approval Date: </strong>
                        {props.request.PEOApprovedDateTime ? props.request.PEOApprovedDateTime.format("DD MMM YYYY [at] HH:mm") : "Not Yet approved"}
                    </Col>
                    <Col className="mt-2" xl={8} lg={8} md={8} sm={6} xs={12}>
                        <strong>Comment on Approval: </strong>
                        {props.request.PEOApprovedComment ? props.request.PEOApprovedComment : "None"}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                        <strong>Requirement Type: </strong>
                        {props.request.NoveltyRequirementType}, {props.request.FuncRequirementType}
                    </Col>
                    <Col className="mt-2" xl={4} lg={4} md={4} sm={6} xs={12}>
                        <strong>Funding Org: </strong>
                        {props.request.FundingOrgOrPEO ? props.request.FundingOrgOrPEO : "Not Funded"}
                    </Col>
                </Row>
                <Row className="ml-2 mr-2 mb-2 view-form">
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
                        <strong>Organization's' Priority: </strong>
                        {props.request.OrgPriority}
                    </Col>
                </Row>
            </Col>
            <Row className="m-3 notes-row">
                {props.notes.notes.map(note =>
                    <Col key={note.Id} className="mt-3 mb-3" xl="4" lg="6" md="12" sm="12" xs="12">
                        <NoteCard
                            note={note}
                            editable={props.notesEditable}
                            editOnClick={() => props.editNoteOnClick(note)}
                            deleteNote={props.notes.deleteNote}
                        />
                    </Col>
                )}
            </Row>
        </Row>
    )

}