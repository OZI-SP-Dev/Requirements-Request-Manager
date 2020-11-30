import React, { FunctionComponent } from "react";
import { IRequirementsRequestCRUD, RequestStatuses } from "../../api/DomainObjects";
import { INote } from "../../api/NotesApi";
import { StatusListItem } from "./StatusListItem";
import './StatusWorkflow.css';


export interface IStatusWorkflowProps {
    request: IRequirementsRequestCRUD,
    notes: INote[]
}

export const StatusWorkflow: FunctionComponent<IStatusWorkflowProps> = (props) => {

    return (
        <ul className="status-workflow p-0 ml-auto mr-auto mb-3 mt-3">
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.SUBMITTED}
                notes={props.notes.filter(n => n.Status === RequestStatuses.SUBMITTED)} />
            {props.request.Status === RequestStatuses.DISAPPROVED &&
                <StatusListItem
                    requestStatus={props.request.Status}
                    className="danger-status"
                    status={RequestStatuses.DISAPPROVED}
                    notes={props.notes.filter(n => n.Status === RequestStatuses.DISAPPROVED)} />
            }
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.APPROVED}
                notes={props.notes.filter(n => n.Status === RequestStatuses.APPROVED)} />
            {props.request.Status === RequestStatuses.DECLINED &&
                <StatusListItem
                    requestStatus={props.request.Status}
                    className="danger-status"
                    status={RequestStatuses.DECLINED}
                    notes={props.notes.filter(n => n.Status === RequestStatuses.DECLINED)} />
            }
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.ACCEPTED}
                notes={props.notes.filter(n => n.Status === RequestStatuses.ACCEPTED)} />
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.REVIEW}
                notes={props.notes.filter(n => n.Status === RequestStatuses.REVIEW)} />
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.CONTRACT}
                notes={props.notes.filter(n => n.Status === RequestStatuses.CONTRACT)} />
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.CLOSED}
                notes={props.notes.filter(n => n.Status === RequestStatuses.CLOSED)} />
        </ul>
    )
}