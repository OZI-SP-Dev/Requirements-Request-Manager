import React, { FunctionComponent, useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Row, Spinner } from "react-bootstrap";
import { INote } from "../../api/DomainObjects";
import './NoteModal.css';

export interface INoteModalProps {
    note?: INote,
    show: boolean,
    error: string,
    clearError: () => void,
    handleClose: () => void,
    submitNote: (title: string, text: string, notifyUsers: boolean) => Promise<any>
}

export const NoteModal: FunctionComponent<INoteModalProps> = (props) => {

    const [noteTitle, setNoteTitle] = useState<string>(props.note ? props.note.Title : "");
    const [noteBody, setNoteBody] = useState<string>(props.note ? props.note.Text : "");
    const [notifyUsers, setNotifyUsers] = useState(false);
    const [saving, setSaving] = useState(false);

    const submitNote = async () => {
        try {
            setSaving(true);
            await props.submitNote(noteTitle, noteBody, notifyUsers);
            setNoteTitle("");
            setNoteBody("");
            setNotifyUsers(false);
            props.handleClose();
        } finally {
            setSaving(false);
        }
    }

    // when the note prop gets update, fill in the fields with its values
    useEffect(() => {
        if (props.note) {
            setNoteTitle(props.note.Title);
            setNoteBody(props.note.Text);
        } else { // clear the fields when the note is undefined bc it will keep the fields if you click the new Note button
            setNoteTitle('');
            setNoteBody('');
        }
        setNotifyUsers(false);
    }, [props.note])

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
                        <Form.Check inline label="Notify Users?" type="checkbox" id="enterprise-checkbox"
                            checked={notifyUsers}
                            onChange={() => setNotifyUsers(!notifyUsers)}
                        />
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