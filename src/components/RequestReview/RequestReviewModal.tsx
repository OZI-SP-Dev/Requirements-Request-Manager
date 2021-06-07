import React, { FunctionComponent, useState } from "react";
import { Alert, Button, Form, Modal, Row, Spinner } from "react-bootstrap";
import { RequestStatuses } from "../../api/DomainObjects";

export interface IRequestReviewModalProps {
    title: string,
    variant: "primary" | "danger",
    nextStatus: RequestStatuses | null,
    commentsFieldLabel: string,
    commentsAreRequired: boolean,
    show: boolean,
    submitButtonText: string,
    handleClose: () => void,
    onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, comments: string) => Promise<any>
}

export const RequestReviewModal: FunctionComponent<IRequestReviewModalProps> = (props) => {

    const [comment, setComment] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>();

    const handleClose = () => {
        setComment("");
        setSaving(false);
        setError(undefined);
        props.handleClose();
    }

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        try {
            setSaving(true);
            if (comment || !props.commentsAreRequired) {
                await props.onSubmit(e, comment);
                setComment("");
                handleClose();
            } else {
                setError(`This field is required to change the status to ${props.nextStatus}`)
            }
        } catch (e) {
            if (e.message) {
                setError(e.message);
            } else if (typeof e === "string") {
                setError(e);
            } else {
                setError("An unknown problem has occurred!");
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="m-2 review-form review-vertical-align">
                            <Form.Label className={`review-form ${props.commentsAreRequired ? "required" : ""}`}><strong>{props.commentsFieldLabel}:</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Notes for your review of the request, required if you are rejecting/cancelling the Request"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                isInvalid={!comment && error !== undefined}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required to change the status to {props.nextStatus}
                            </Form.Control.Feedback>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Button className="mr-2" variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant={props.variant} onClick={submit}>
                            {saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}{props.submitButtonText}
                        </Button>
                    </Row>
                    {error &&
                        <Row className="note-error">
                            <Alert variant="danger" onClose={() => setError(undefined)} dismissible>
                                <Alert.Heading>Error Submitting!</Alert.Heading>
                                <p>{error}</p>
                            </Alert>
                        </Row>}
                </Modal.Footer>
            </Modal>
        </>
    );
}