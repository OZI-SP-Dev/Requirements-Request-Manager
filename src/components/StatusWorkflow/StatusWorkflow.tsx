import React from "react";
import { FunctionComponent } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { IRequirementsRequestCRUD, RequestStatuses } from "../../api/DomainObjects";
import { INotes } from "../../hooks/useNotes";
import './StatusWorkflow.css'


export interface IStatusWorkflowProps {
    request: IRequirementsRequestCRUD,
    notes: INotes
}

export const StatusWorkflow: FunctionComponent<IStatusWorkflowProps> = (props) => {
    let statuses = [
        RequestStatuses.SUBMITTED,
        RequestStatuses.DISAPPROVED,
        RequestStatuses.APPROVED,
        RequestStatuses.DECLINED,
        RequestStatuses.ACCEPTED,
        RequestStatuses.REVIEW,
        RequestStatuses.CONTRACT,
        RequestStatuses.CLOSED
    ]

    // This is all of the completed statuses with the active status as the last item in the array
    let requestStatuses = statuses.slice(0, statuses.findIndex(s => s === props.request.Status));

    const getClass = (status: RequestStatuses): "active-status" | "completed-status" | "inactive-status" => {
        return props.request.Status === status ? "active-status" : requestStatuses.includes(status) ? "completed-status" : "inactive-status";
    }

    return (
        <Card className="status-workflow-card p-2 pr-4 m-3">
            <ul className="status-workflow p-0 m-0">
                <li className={getClass(RequestStatuses.SUBMITTED)}>
                    <div>{RequestStatuses.SUBMITTED}</div>
                </li>
                {props.request.Status === RequestStatuses.DISAPPROVED &&
                    <li className="danger-status">
                        <div>{RequestStatuses.DISAPPROVED}</div>
                    </li>
                }
                <li className={getClass(RequestStatuses.APPROVED)}>
                    <div>{RequestStatuses.APPROVED}</div>
                </li>
                {props.request.Status === RequestStatuses.DECLINED &&
                    <li className="danger-status">
                        <div>{RequestStatuses.DECLINED}</div>
                    </li>
                }
                <li className={getClass(RequestStatuses.ACCEPTED)}>
                    <div>{RequestStatuses.ACCEPTED}</div>
                </li>
                <li className={getClass(RequestStatuses.REVIEW)}>
                    <div>{RequestStatuses.REVIEW}</div>
                </li>
                <li className={getClass(RequestStatuses.CONTRACT)}>
                    <div>{RequestStatuses.CONTRACT}</div>
                </li>
                <li className={getClass(RequestStatuses.CLOSED)}>
                    <div>{RequestStatuses.CLOSED}</div>
                </li>
            </ul>
        </Card>
    )
}