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
        let nextStatus = getNextStatus(request);
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

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>{userCanReview ? "Review" : "View"} Request</h1>
            <RequestView request={request} loadNotes size="lg" />
            <hr />
            {userCanReview &&
                <Form>
                    <Row className="m-2 review-form review-vertical-align">
                        <Form.Label className="review-form"><strong>Review Notes:</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Notes for your review of the request"
                            value={comment}
                            onChange={e => updateComment(e.target.value)}
                            isInvalid={!comment && error !== undefined}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error ? error : ""}
                        </Form.Control.Feedback>
                    </Row>
                </Form>
            }
            <Row className="review-vertical-align m-2">
                {RoleDefinitions.userCanChangeStatus(request, RequestStatuses.CANCELLED, user, roles) && <>
                    <ConfirmPopover
                        show={showCancelPopover}
                        target={cancelPopoverTarget}
                        variant="danger"
                        titleText="Cancel Request"
                        confirmationText="Are you sure you want to cancel this request?"
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) =>
                            updateStatus(e, RequestStatuses.CANCELLED)}
                        handleClose={() => setShowCancelPopover(false)}
                    />
                    <Button className="mr-2"
                        variant="danger"
                        disabled={!request}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setCancelPopoverTarget(event.target);
                            setShowCancelPopover(true);
                        }}
                    >
                        {statusBeingSubmit === RequestStatuses.CANCELLED && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Cancel Request"}
                    </Button>
                </>}
                <Button className="mr-auto" variant="secondary" href="#/Requests">
                    {userCanReview ? "Cancel" : "Close"}
                </Button>
                {request && !request.isReadOnly(user, roles) &&
                    <Button className="ml-auto" variant="warning" href={`#/Requests/Edit/${request.Id}`}>
                        Edit Request
                    </Button>
                }
                {userCanReview && getRejectStatus(request) && <>
                    <ConfirmPopover
                        show={showRejectPopover}
                        target={rejectPopoverTarget}
                        variant="danger"
                        titleText="Reject Request"
                        confirmationText={`Are you sure you want to set this Request's status to ${getRejectStatus(request)}?`}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, getRejectStatus(request))}
                        handleClose={() => setShowRejectPopover(false)}
                    />
                    <Button className="ml-2"
                        variant="danger"
                        disabled={!request}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setRejectPopoverTarget(event.target);
                            setShowRejectPopover(true);
                        }}
                    >
                        {statusBeingSubmit === getRejectStatus(request) && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Set to " + getRejectStatus(request)}
                    </Button>
                </>}
                {userCanReview && <>
                    <ConfirmPopover
                        show={showAffirmPopover}
                        target={affirmPopoverTarget}
                        variant="primary"
                        titleText="Advance Request"
                        confirmationText={`Are you sure you want to set this Request's status to ${getNextStatus(request)}?`}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, getNextStatus(request))}
                        handleClose={() => setShowAffirmPopover(false)}
                    />
                    <Button className="ml-2"
                        disabled={!request}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            setAffirmPopoverTarget(event.target);
                            setShowAffirmPopover(true);
                        }}
                    >
                        {statusBeingSubmit === getNextStatus(request) && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Set to " + getNextStatus(request)}
                    </Button>
                </>}
            </Row>
            <RequestSpinner show={statusBeingSubmit !== undefined} displayText="Updating Request..." />
        </Container>
    );

}