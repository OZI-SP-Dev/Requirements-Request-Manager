import { FunctionComponent, useState } from "react";
import React from "react";
import { Modal, Button, Form, Spinner, Alert, Row } from "react-bootstrap";
import { INote } from "../../api/NotesApi";
import './NoteModal.css'

export interface INoteModalProps {
    note?: INote,
    show: boolean,
    error: string,
    clearError: () => void,
    handleClose: () => void,
    submitNote: (title: string, text: string) => Promise<any>
}

export const NoteModal: FunctionComponent<INoteModalProps> = (props) => {

    const [noteTitle, setNoteTitle] = useState<string>(props.note ? props.note.Title : "");
    const [noteBody, setNoteBody] = useState<string>(props.note ? props.note.Text : "");
    const [saving, setSaving] = useState(false);

    const submitNote = () => {
        setSaving(true);
        props.submitNote(noteTitle, noteBody).then(() => {
            setNoteTitle("");
            setNoteBody("");
            setSaving(false);
            props.handleClose();
        }).catch(() => setSaving(false));
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${props.note ? "Edit" : "New"} Note`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Note Title:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a title for this note"
                                value={noteTitle}
                                onChange={e => setNoteTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Note Body:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Enter the body of the note"
                                value={noteBody}
                                onChange={e => setNoteBody(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Button className="mr-2" variant="secondary" onClick={props.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submitNote}>
                            {saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}{"Save Note"}
                        </Button>
                    </Row>
                    {props.error &&
                        <Row className="note-error">
                            <Alert variant="danger" onClose={props.clearError} dismissible>
                                <Alert.Heading>Error Submitting!</Alert.Heading>
                                <p>{props.error}</p>
                            </Alert>
                        </Row>}
                </Modal.Footer>
            </Modal>
        </>
    );
}