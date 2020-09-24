import { FunctionComponent, useState } from "react";
import { INote } from "../../api/NotesApi";
import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import './NoteCard.css'
import { ConfirmPopover } from "../ConfirmPopover/ConfirmPopover";

export interface INoteCardProps {
    note: INote,
    editable: boolean,
    editOnClick: () => void,
    deleteNote: (note: INote) => Promise<void>
}

export const NoteCard: FunctionComponent<INoteCardProps> = (props) => {

    const [deleting, setDeleting] = useState<boolean>();
    const [showDeletePopover, setShowDeletePopover] = useState<boolean>(false);
    const [deletePopoverTarget, setDeletePopoverTarget] = useState<any>();

    const deleteNote = async () => {
        try {
            if (props.editable) {
                setDeleting(true);
                await props.deleteNote(props.note);
            }
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Card className="note">
            <Card.Header className="note-header">{props.note.Title}</Card.Header>
            <Card.Body><p className="preserve-whitespace">{props.note.Text}</p></Card.Body>
            {props.editable &&
                <Card.Footer>
                    <ConfirmPopover
                        show={showDeletePopover}
                        target={deletePopoverTarget}
                        variant="danger"
                        titleText="Delete Note"
                        confirmationText="Are you sure you want to delete this note?"
                        onSubmit={deleteNote}
                        handleClose={() => setShowDeletePopover(false)}
                    />
                    <Button
                        variant="outline-danger"
                        className="float-left"
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setDeletePopoverTarget(event.target);
                            setShowDeletePopover(true);
                        }}
                    >
                        {deleting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Delete"}
                    </Button>
                    <Button className="notes-button float-right" onClick={props.editOnClick}>
                        Edit
                </Button>
                </Card.Footer>
            }
        </Card>
    );

}