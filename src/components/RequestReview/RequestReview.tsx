import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { getNextStatus, getRejectStatus, IRequirementsRequest, IRequirementsRequestCRUD, RequestStatuses, RequirementsRequest } from "../../api/DomainObjects";
import { InternalError } from "../../api/InternalErrors";
import { useRedirect } from "../../hooks/useRedirect";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import { ConfirmPopover } from "../ConfirmPopover/ConfirmPopover";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { RequestView } from "../RequestView/RequestView";
import "./RequestReview.css";


export interface IRequestReviewProps {
    requestId?: number,
    fetchRequestById?: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    // if not provided, this will be treated as a read-only view
    updateStatus?: (request: IRequirementsRequestCRUD, status: RequestStatuses, comment: string) => Promise<void>
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    const { user, roles } = useContext(UserContext);

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [comment, setComment] = useState<string>("");
    const [statusBeingSubmit, setStatusBeingSubmit] = useState<RequestStatuses>();
    const [userCanReview, setUserCanReview] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [cancelPopoverTarget, setCancelPopoverTarget] = useState<any>(null);
    const [showCancelPopover, setShowCancelPopover] = useState<boolean>(false);
    const [rejectPopoverTarget, setRejectPopoverTarget] = useState<any>(null);
    const [showRejectPopover, setShowRejectPopover] = useState<boolean>(false);
    const [affirmPopoverTarget, setAffirmPopoverTarget] = useState<any>(null);
    const [showAffirmPopover, setShowAffirmPopover] = useState<boolean>(false);

    const { redirect, pushRoute } = useRedirect();

    useScrollToTop();

    const getRequest = async () => {
        if (props.requestId !== undefined && props.fetchRequestById) {
            let newRequest = await props.fetchRequestById(props.requestId);
            if (newRequest) {
                setRequest(newRequest);
                setUserCanReview(checkIfUserCanReview(newRequest));
            } else {
                redirect("/Requests");
            }
        }
    }

    const checkIfUserCanReview = (request: IRequirementsRequest): boolean => {
        let nextStatus = getNextStatus(request.Status);
        return props.updateStatus !== undefined && user !== undefined && request !== undefined && nextStatus !== null && RoleDefinitions.userCanChangeStatus(request, nextStatus, user, roles);
    }

    // We need to update the state's request whenever the props.editRequest changes because the requests may not have loaded yet
    useEffect(() => {
        getRequest(); // eslint-disable-next-line
    }, [props.requestId])

    useEffect(() => {
        setUserCanReview(checkIfUserCanReview(request)); // eslint-disable-next-line
    }, [user, props.updateStatus])

    const updateComment = (value: string): void => {
        setComment(value);
    }

    const updateStatus = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, status: RequestStatuses | null) => {
        try {
            if (status) {
                setStatusBeingSubmit(status);
                if (request && props.updateStatus) {
                    await props.updateStatus(request, status, comment);
                }
                pushRoute("/Requests", e);
            }
        } catch (e) {
            console.error("Error while approving Request on Review page");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
            }
        } finally {
            setStatusBeingSubmit(undefined);
        }
    }

    const getStatusButtonText = (status: RequestStatuses | null): string => {
        switch (status) {
            case RequestStatuses.SUBMITTED:
                return "Submit Request";
            case RequestStatuses.APPROVED:
                return "Approve Request";
            case RequestStatuses.DISAPPROVED:
                return "Disapprove Request";
            case RequestStatuses.ACCEPTED:
                return "Accept Request";
            case RequestStatuses.DECLINED:
                return "Decline Request";
            case RequestStatuses.REVIEW:
                return "Approved for Contract";
            case RequestStatuses.CONTRACT:
                return "Request On Contract";
            case RequestStatuses.CLOSED:
                return "Close Request";
            case RequestStatuses.CANCELLED:
                return "Cancel Request";
            default:
                return "Submit";
        }
    }

    let nextStatus = getNextStatus(request.Status);
    let rejectStatus = getRejectStatus(request);
    let userCanCancel = RoleDefinitions.userCanChangeStatus(request, RequestStatuses.CANCELLED, user, roles);
    let userCanEdit = request && !request.isReadOnly(user, roles);
    let userCanReject = userCanReview && rejectStatus;

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <Row>
                <Button disabled={statusBeingSubmit !== undefined} className="mb-3 mr-auto back-button" variant="secondary" href="#/Requests">
                    Back
                </Button>
            </Row>
            <h1>{userCanReview ? "Review" : "View"} Request</h1>
            <RequestView request={request} loadNotes size="lg" />
            <hr />
            {(userCanReview || userCanCancel) &&
                <Form>
                    <Row className="m-2 review-form review-vertical-align">
                        <Form.Label className="review-form required"><strong>Review Comments:</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Notes for your review of the request, required if you are rejecting/cancelling the Request"
                            value={comment}
                            onChange={e => updateComment(e.target.value)}
                            isInvalid={!comment && error !== undefined}
                        />
                        <Form.Control.Feedback type="invalid">
                            This field is required to change the status to Cancelled or {rejectStatus}
                        </Form.Control.Feedback>
                    </Row>
                </Form>
            }
            <Row className="review-vertical-align m-2">
                {userCanCancel && <>
                    <ConfirmPopover
                        show={showCancelPopover}
                        target={cancelPopoverTarget}
                        variant="danger"
                        titleText={getStatusButtonText(RequestStatuses.CANCELLED)}
                        confirmationText="Are you sure you want to cancel this request?"
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) =>
                            updateStatus(e, RequestStatuses.CANCELLED)}
                        handleClose={() => setShowCancelPopover(false)}
                    />
                    <Button className="mr-auto"
                        variant="danger"
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setCancelPopoverTarget(event.target);
                            setShowCancelPopover(true);
                        }}
                    >
                        {statusBeingSubmit === RequestStatuses.CANCELLED && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{getStatusButtonText(RequestStatuses.CANCELLED)}
                    </Button>
                </>}
                {userCanEdit &&
                    <Button disabled={statusBeingSubmit !== undefined} className="ml-auto" variant="warning" href={`#/Requests/Edit/${request.Id}`}>
                        Edit Request
                    </Button>
                }
                {userCanReject && <>
                    <ConfirmPopover
                        show={showRejectPopover}
                        target={rejectPopoverTarget}
                        variant="danger"
                        titleText={getStatusButtonText(rejectStatus)}
                        confirmationText={`Are you sure you want to set this Request's status to ${rejectStatus}?`}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, rejectStatus)}
                        handleClose={() => setShowRejectPopover(false)}
                    />
                    <Button className="ml-2"
                        variant="danger"
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setRejectPopoverTarget(event.target);
                            setShowRejectPopover(true);
                        }}
                    >
                        {statusBeingSubmit === rejectStatus && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{getStatusButtonText(rejectStatus)}
                    </Button>
                </>}
                {userCanReview && <>
                    <ConfirmPopover
                        show={showAffirmPopover}
                        target={affirmPopoverTarget}
                        variant="primary"
                        titleText={getStatusButtonText(nextStatus)}
                        confirmationText={`Are you sure you want to set this Request's status to ${nextStatus}?`}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, nextStatus)}
                        handleClose={() => setShowAffirmPopover(false)}
                    />
                    <Button className={userCanCancel || userCanEdit || userCanReject ? "ml-2" : "ml-auto"}
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setAffirmPopoverTarget(event.target);
                            setShowAffirmPopover(true);
                        }}
                    >
                        {statusBeingSubmit === nextStatus && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{getStatusButtonText(nextStatus)}
                    </Button>
                </>}
            </Row>
            <RequestSpinner show={statusBeingSubmit !== undefined} displayText="Updating Request..." />
        </Container>
    );

}