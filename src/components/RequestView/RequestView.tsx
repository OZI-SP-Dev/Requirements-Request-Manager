import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { IRequirementsRequestCRUD, RequirementsRequest } from "../../api/DomainObjects";
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
    userCanAddNotes: boolean,
    addNoteOnClick: () => void
}

export const RequestView: FunctionComponent<IRequestViewProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(props.request ? props.request : new RequirementsRequest());
    const [showNoteModal, setShowNoteModal] = useState<boolean>(false);

    const notes: INotes = useNotes(props.loadNotes ? props.request?.Id : undefined);
    const email: IEmailSender = useEmail();

    const { user, roles } = useContext(UserContext);

    useEffect(() => {
        setRequest(props.request ? props.request : new RequirementsRequest());
    }, [props.request]);

    const submitNote = async (title: string, text: string, notifyUsers: boolean) => {
        let newNote = await notes.submitNewNote(title, text);
        if (notifyUsers) {
            await email.sendNoteEmail(request, newNote);
        }
        return newNote;
    }

    const editNoteOnClick = () => {
        if (RoleDefinitions.userCanAddNotes(request, roles, user)) {
            setShowNoteModal(true);
        }
    }

    return (
        props.request ?
            <Row className="ml-3 mr-3 align-items-start">
                {
                    props.size === "lg" ?
                        <RequestViewLarge
                            request={request}
                            notes={notes}
                            userCanAddNotes={RoleDefinitions.userCanAddNotes(request, roles, user)}
                            addNoteOnClick={editNoteOnClick}
                        /> :
                        <RequestViewSmall
                            request={request}
                            notes={notes}
                            userCanAddNotes={RoleDefinitions.userCanAddNotes(request, roles, user)}
                            addNoteOnClick={editNoteOnClick}
                        />
                }
                < NoteModal
                    show={showNoteModal && RoleDefinitions.userCanAddNotes(request, roles, user)
                    }
                    error={notes.error}
                    clearError={notes.clearError}
                    handleClose={() => {
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
            : <h5 className="text-center">No information was found for this Request</h5>
    )

}