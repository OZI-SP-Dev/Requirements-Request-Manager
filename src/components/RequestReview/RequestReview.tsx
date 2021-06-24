import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import { getNextStatus, getRejectStatus, IRequirementsRequest, IRequirementsRequestCRUD, RequestStatuses, RequirementsRequest } from "../../api/DomainObjects";
import { useRedirect } from "../../hooks/useRedirect";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { RequestView } from "../RequestView/RequestView";
import "./RequestReview.css";
import { RequestReviewModal } from "./RequestReviewModal";


export interface IRequestReviewProps {
    requestId?: number,
    fetchRequestById?: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    // if not provided, this will be treated as a read-only view
    updateStatus?: (request: IRequirementsRequestCRUD, status: RequestStatuses, comment: string) => Promise<void>
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    const { user, roles } = useContext(UserContext);

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [statusBeingSubmit, setStatusBeingSubmit] = useState<RequestStatuses>();
    const [userCanReview, setUserCanReview] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
    const [showAffirmModal, setShowAffirmModal] = useState<boolean>(false);

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
    }, [user, props.updateStatus]);

    const updateStatus = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, status: RequestStatuses | null, comment: string) => {
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
            throw e;
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
            case RequestStatuses.CIO_APPROVED:
                return "Approve Request";
            case RequestStatuses.CIO_DISAPPROVED:
                return "Disapprove Request";
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
        <Container fluid className="pb-5 pt-3">
            <Row>
                <Button disabled={statusBeingSubmit !== undefined} className="mb-3 mr-auto back-button" variant="secondary" href="#/Requests">
                    Back
                </Button>
            </Row>
            <h1>{userCanReview ? "Review" : "View"} Request</h1>
            <RequestView request={request} loadNotes size="lg" />
            <hr />
            <Row className="review-vertical-align m-2">
                {userCanCancel && <>
                    <RequestReviewModal
                        title={getStatusButtonText(RequestStatuses.CANCELLED)}
                        variant="danger"
                        nextStatus={RequestStatuses.CANCELLED}
                        commentsFieldLabel={"Cancellation Comments"}
                        commentsAreRequired
                        show={showCancelModal}
                        submitButtonText="Cancel Request"
                        handleClose={() => setShowCancelModal(false)}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, comment: string) =>
                            updateStatus(e, RequestStatuses.CANCELLED, comment)}
                    />
                    <Button className="mr-auto"
                        variant="danger"
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={() => setShowCancelModal(true)}
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
                    <RequestReviewModal
                        title={getStatusButtonText(rejectStatus)}
                        variant="danger"
                        nextStatus={rejectStatus}
                        commentsFieldLabel={"Rejection Comments"}
                        commentsAreRequired
                        show={showRejectModal}
                        submitButtonText={getStatusButtonText(rejectStatus)}
                        handleClose={() => setShowRejectModal(false)}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, comment: string) =>
                            updateStatus(e, rejectStatus, comment)}
                    />
                    <Button className="ml-2"
                        variant="danger"
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={() => setShowRejectModal(true)}
                    >
                        {statusBeingSubmit === rejectStatus && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{getStatusButtonText(rejectStatus)}
                    </Button>
                </>}
                {userCanReview && <>
                    <RequestReviewModal
                        title={getStatusButtonText(nextStatus)}
                        variant="primary"
                        nextStatus={nextStatus}
                        commentsFieldLabel={"Approval Comments"}
                        commentsAreRequired={false}
                        show={showAffirmModal}
                        submitButtonText={getStatusButtonText(nextStatus)}
                        handleClose={() => setShowAffirmModal(false)}
                        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, comment: string) =>
                            updateStatus(e, nextStatus, comment)}
                    />
                    <Button className={userCanCancel || userCanEdit || userCanReject ? "ml-2" : "ml-auto"}
                        disabled={!request || statusBeingSubmit !== undefined}
                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setShowAffirmModal(true)}
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