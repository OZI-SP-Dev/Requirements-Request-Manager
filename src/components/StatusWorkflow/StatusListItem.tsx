import React, { FunctionComponent, useState } from "react";
import { getNextStatus, getStatusText, INote, RequestStatuses } from "../../api/DomainObjects";
import { InfoPopover } from "../InfoPopover/InfoPopover";
import './StatusWorkflow.css';


export interface IStatusListItemProps {
    requestStatus: RequestStatuses,
    status: RequestStatuses,
    notes: INote[],
    className?: string
}

export const StatusListItem: FunctionComponent<IStatusListItemProps> = (props) => {

    const [showPopover, setShowPopover] = useState<boolean>(false);
    const [popoverTarget, setPopoverTarget] = useState<any>(null);

    let statuses = [
        RequestStatuses.SUBMITTED,
        RequestStatuses.DISAPPROVED,
        RequestStatuses.APPROVED,
        RequestStatuses.DECLINED,
        RequestStatuses.ACCEPTED,
        RequestStatuses.CITO_DISAPPROVED,
        RequestStatuses.CITO_APPROVED,
        RequestStatuses.REVIEW,
        RequestStatuses.CONTRACT,
        RequestStatuses.CLOSED
    ]

    // This is all of the completed statuses with the active status as the last item in the array
    let requestStatuses = statuses.slice(0, statuses.findIndex(s => s === props.requestStatus) + 1);

    const statusClass: "active-status" | "completed-status" | "inactive-status" =
        props.status === getNextStatus(props.requestStatus) ? "active-status" : requestStatuses.includes(props.status) ? "completed-status" : "inactive-status";

    return (
        <>
            <InfoPopover
                show={showPopover}
                target={popoverTarget}
                placement="bottom"
                titleText={`Notes on ${props.status} Status`}
                handleClose={() => setShowPopover(false)}
            >
                {props.notes.map(note =>
                    <>
                        <p className="preserve-whitespace">{note.Text ? note.Text : "No Notes"}</p>
                        <p><i>-{note.Author.Title} on {note.Modified.format("DD MMM YYYY [at] hh:mm")}</i></p>
                    </>
                )}
            </InfoPopover>
            <li onClick={e => {
                if (props.notes.length > 0 && requestStatuses.includes(props.status)) {
                    setPopoverTarget(e.target);
                    setShowPopover(true);
                }
            }} className={props.className ? props.className : statusClass}>
                <div>{getStatusText(props.status)}</div>
            </li>
        </>
    );
}