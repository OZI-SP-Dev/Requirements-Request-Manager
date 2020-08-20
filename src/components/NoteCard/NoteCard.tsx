import { FunctionComponent, useState } from "react";
import { INote } from "../../api/NotesApi";
import React from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import './NoteCard.css'

export interface INoteCardProps {
    note: INote,
    editOnClick: () => void,
    deleteNote: (note: INote) => Promise<void>
}

export const NoteCard: FunctionComponent<INoteCardProps> = (props) => {

    const [deleting, setDeleting] = useState<boolean>();

    const deleteNote = async () => {
        try {
            setDeleting(true);
            await props.deleteNote(props.note);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Card className="note">
            <Card.Header className="note-header">{props.note.Title}</Card.Header>
            <Card.Body><p className="preserve-whitespace">{props.note.Text}</p></Card.Body>
            <Card.Footer>
                <Button
                    variant="outline-danger"
                    className="float-left"
                    onClick={deleteNote}
                >
                    {deleting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}{"Delete"}
                </Button>
                <Button className="notes-button float-right" onClick={props.editOnClick}>
                    Edit
                </Button>
            </Card.Footer>
        </Card>
    );

}