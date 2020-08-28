import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../../api/DomainObjects";
import { INote } from '../../api/NotesApi';
import { IEmailSender, useEmail } from "../../hooks/useEmail";
import { INotes, useNotes } from "../../hooks/useNotes";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import { DismissableErrorAlert } from "../DismissableErrorAlert/DismissableErrorAlert";
import { NoteModal } from '../NoteModal/NoteModal';
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import "./RequestView.css";
import { RequestViewLarge } from "./RequestViewLarge";
import { RequestViewSmall } from "./RequestViewSmall";

export interface IRequestViewProps {
    request?: IRequirementsRequestCRUD,
    loadNotes: boolean,
    size: "lg" | "sm"
}

export interface IRequestViewChildProps {
    request: IRequirementsRequestCRUD,
    notes: INotes,
    notesEditable: boolean,
    editNoteOnClick: (note?: INote) => void
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(props.request ? props.request : new RequirementsRequest());
    const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
    const [editNote, setEditNote] = useState<INote>();

    const notes: INotes = useNotes(props.loadNotes ? props.request?.Id : undefined);
    const email: IEmailSender = useEmail();

    const { roles } = useContext(UserContext);

    useEffect(() => {
        setRequest(props.request ? props.request : new RequirementsRequest());
    }, [props.request]);

    const submitNote = async (title: string, text: string, notifyUsers: boolean) => {
        let newNote = editNote ? await notes.updateNote({ ...editNote, Title: title, Text: text }) : await notes.submitNewNote(title, text);
        if (notifyUsers) {
            await email.sendNoteEmail(request, newNote);
        }
        return newNote;
    }

    const editNoteOnClick = (note?: INote) => {
        if (RoleDefinitions.userCanEditNotes(roles)) {
            setEditNote(note);
            setShowNoteModal(true);
        }
    }

    return (
        <Row>
            {props.size === "lg" ?
                <RequestViewLarge
                    request={request}
                    notes={notes}
                    notesEditable={RoleDefinitions.userCanEditNotes(roles)}
                    editNoteOnClick={editNoteOnClick}
                /> :
                <RequestViewSmall
                    request={request}
                    notes={notes}
                    notesEditable={RoleDefinitions.userCanEditNotes(roles)}
                    editNoteOnClick={editNoteOnClick}
                />}
            <NoteModal
                note={editNote}
                show={showNoteModal && RoleDefinitions.userCanEditNotes(roles)}
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