import React, { FunctionComponent } from "react";
import { Card, Col } from "react-bootstrap";
import { RequestStatuses } from "../../api/DomainObjects";
import { INote } from "../../api/NotesApi";
import './NoteCard.css';

export interface INoteCardProps {
    note: INote
}

export const NoteCard: FunctionComponent<INoteCardProps> = (props) => {

    const authorNameRegEx = new RegExp('^(\\w+, \\w+ \\w?)').exec(props.note.Author.Title);

    const getNoteClass = (): string => {
        switch (props.note.Status) {
            case RequestStatuses.SUBMITTED:
            case RequestStatuses.APPROVED:
            case RequestStatuses.ACCEPTED:
            case RequestStatuses.CITO_APPROVED:
            case RequestStatuses.REVIEW:
            case RequestStatuses.CONTRACT:
            case RequestStatuses.CLOSED:
                return "good-note";
            case RequestStatuses.DISAPPROVED:
            case RequestStatuses.DECLINED:
            case RequestStatuses.CITO_DISAPPROVED:
                return "bad-note";
            default:
                return "";
        }
    }

    return (
        <Card className={"note " + getNoteClass()}>
            <Card.Body as={Col} className="p-2">
                <p className="preserve-whitespace mb-0">
                    <strong>{props.note.Title}</strong><br />
                    {props.note.Text}<br />
                </p>
                <p className="note-timestamp float-right mb-0">
                    -<i>{authorNameRegEx ? authorNameRegEx[0] : props.note.Author.Title} at {props.note.Modified.format("DD MMM YYYY h:mm A")}</i>
                </p>
            </Card.Body>
        </Card>
    );

}