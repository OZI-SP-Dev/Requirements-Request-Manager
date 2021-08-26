import React, { FunctionComponent } from "react";
import { INote, IRequirementsRequestCRUD, RequestStatuses } from "../../api/DomainObjects";
import { StatusListItem } from "./StatusListItem";
import './StatusWorkflow.css';


export interface IStatusWorkflowProps {
    request: IRequirementsRequestCRUD,
    notes: INote[]
}

export const StatusWorkflow: FunctionComponent<IStatusWorkflowProps> = (props) => {

    return (
        <ul className="status-workflow p-0 mr-auto mb-3 mt-3">
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
            {props.request.Status === RequestStatuses.CITO_DISAPPROVED &&
                <StatusListItem
                    requestStatus={props.request.Status}
                    className="danger-status"
                    status={RequestStatuses.CITO_DISAPPROVED}
                    notes={props.notes.filter(n => n.Status === RequestStatuses.CITO_DISAPPROVED)} />
            }
            <StatusListItem
                requestStatus={props.request.Status}
                status={RequestStatuses.CITO_APPROVED}
                notes={props.notes.filter(n => n.Status === RequestStatuses.CITO_APPROVED)} />
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