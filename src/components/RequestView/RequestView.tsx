import React, { FunctionComponent, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { IRequirementsRequest, RequirementsRequest } from "../../api/DomainObjects";
import { INote } from '../../api/NotesApi';
import { INotes, useNotes } from "../../hooks/useNotes";
import { DismissableErrorAlert } from "../DismissableErrorAlert/DismissableErrorAlert";
import { NoteModal } from '../NoteModal/NoteModal';
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import "./RequestView.css";
import { RequestViewLarge } from "./RequestViewLarge";
import { RequestViewSmall } from "./RequestViewSmall";

export interface IRequestViewProps {
    request?: IRequirementsRequest,
    loadNotes: boolean,
    size: "lg" | "sm"
}

export interface IRequestViewChildProps {
    request: IRequirementsRequest,
    notes: INotes,
    editNoteOnClick: (note?: INote) => void
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(props.request ? props.request : new RequirementsRequest());
    const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
    const [editNote, setEditNote] = useState<INote>();

    const notes: INotes = useNotes(props.loadNotes ? props.request?.Id : undefined);

    useEffect(() => {
        setRequest(props.request ? props.request : new RequirementsRequest());
    }, [props.request]);

    const submitNote = (title: string, text: string) => {
        return editNote ? notes.updateNote({ ...editNote, Title: title, Text: text }) : notes.submitNewNote(title, text);
    }

    const editNoteOnClick = (note?: INote) => {
        setEditNote(note);
        setShowNoteModal(true);
    }

    return (
        <Row>
            {props.size === "lg" ?
                <RequestViewLarge request={request} notes={notes} editNoteOnClick={editNoteOnClick} /> :
                <RequestViewSmall request={request} notes={notes} editNoteOnClick={editNoteOnClick} />}
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
            <DismissableErrorAlert
                show={notes.error !== undefined && notes.error !== "" && !showNoteModal}
                header="Error!"
                message={notes.error}
                onClose={notes.clearError}
            />
        </Row>
    )

}