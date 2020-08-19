import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { ApplicationTypes, IRequirementsRequest, IRequirementsRequestCRUD, RequirementsRequest } from "../../api/DomainObjects";
import { INote } from '../../api/NotesApi';
import { INotes, useNotes } from "../../hooks/useNotes";
import { NoteModal } from '../NoteModal/NoteModal';
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import "./RequestView.css";

export interface IRequestViewProps {
    request?: IRequirementsRequestCRUD,
    load: boolean,
    size: "lg" | "sm"
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(props.request ? props.request : new RequirementsRequest());
    const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
    const [editNote, setEditNote] = useState<INote>();
    const [deletingNoteId, setDeletingNoteId] = useState<number>();

    const notes: INotes = useNotes(props.load ? props.request?.Id : undefined);

    const lgDisplay: boolean = props.size === "lg";
    const notesEmpty: boolean = notes.notes.length === 0;

    useEffect(() => {
        setRequest(props.request ? props.request : new RequirementsRequest());
    }, [props.request]);

    const getDetailsColSize = (size: "xl" | "lg" | "md" | "sm" | "xs"): number => {
        if (size === "xl" || size === "lg") {
            if (lgDisplay && notesEmpty) {
                return 10;
            } else if (lgDisplay) {
                return 8;
            } else {
                return 12;
            }
        } else {
            return 12;
        }
    }

    const submitNote = (title: string, text: string) => {
        return editNote ? notes.updateNote({ ...editNote, Title: title, Text: text }) : notes.submitNewNote(title, text);
    }

    const deleteNote = async (note: INote) => {
        setDeletingNoteId(note.Id);
        await notes.deleteNote(note);
        setDeletingNoteId(note.Id);
    }

    let noteCards = notes.notes.map(note =>
        <Col className="mt-3 mb-3" xl={lgDisplay ? "12" : "4"} lg={lgDisplay ? "12" : "6"} md="12" sm="12" xs="12">
            <Card className="note">
                <Card.Header className="note-header">{note.Title}</Card.Header>
                <Card.Body><p className="preserve-whitespace">{note.Text}</p></Card.Body>
                <Card.Footer>
                    <Button
                        variant="outline-danger"
                        className="float-left"
                        onClick={() => deleteNote(note)}
                    >
                        {deletingNoteId === note.Id && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Delete"}
                    </Button>
                    <Button
                        className="notes-button float-right"
                        onClick={() => {
                            setEditNote(note);
                            setShowNoteModal(true);
                        }}
                    >Edit</Button>
                </Card.Footer>
            </Card>
        </Col>
    );

    return (
        <Row>
            <Col
                xl={getDetailsColSize("xl")}
                lg={getDetailsColSize("lg")}
                md={getDetailsColSize("md")}
                sm={getDetailsColSize("sm")}
                xs={getDetailsColSize("xs")}
            >
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
                        {request.ReceivedDate ? request.ReceivedDate.format("DD MMM YYYY") : "None"}
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
            </Col>
            {lgDisplay ?
                <Col xl={notesEmpty ? "2" : "4"} lg={notesEmpty ? "2" : "4"} md="12" sm="12" xs="12">
                    <Row>
                        <Col>
                            <Button className="notes-button m-3 float-right" onClick={() => setShowNoteModal(true)}>New Note</Button>
                        </Col>
                    </Row>
                    <Card className="notes-card">
                        {noteCards}
                    </Card>
                </Col> :
                <Row className="m-3 notes-row">
                    {noteCards}
                </Row>
            }
            <NoteModal
                note={editNote}
                show={showNoteModal}
                error={notes.error}
                clearError={notes.clearError}
                handleClose={() => {
                    setEditNote(undefined);
                    setShowNoteModal(false);
                    notes.clearError();
                }}
                submitNote={submitNote}
            />
            <RequestSpinner show={notes.loading} displayText="Loading Notes..." />
        </Row>
    )

}