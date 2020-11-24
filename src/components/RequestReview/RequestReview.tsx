import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { getNextStatus, getRejectStatus, IRequirementsRequest, IRequirementsRequestCRUD, RequestStatuses, RequirementsRequest } from "../../api/DomainObjects";
import { useRedirect } from "../../hooks/useRedirect";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
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
                        />
                    </Row>
                </Form>
            }
            <Row className="review-vertical-align m-2">
                {RoleDefinitions.userCanChangeStatus(request, RequestStatuses.CANCELLED, user, roles) &&
                    <Button className="mr-2"
                        variant="danger"
                        disabled={!request}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, RequestStatuses.CANCELLED)}
                    >
                        {statusBeingSubmit === RequestStatuses.CANCELLED && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Cancel Request"}
                    </Button>
                }
                <Button className="mr-auto" variant="secondary" href="#/Requests">
                    {userCanReview ? "Cancel" : "Close"}
                </Button>
                {request && !request.isReadOnly(user, roles) &&
                    <Button className="ml-auto" variant="warning" href={`#/Requests/Edit/${request.Id}`}>
                        Edit Request
                    </Button>
                }
                {userCanReview && getRejectStatus(request) &&
                    <Button className="ml-2"
                        variant="danger"
                        disabled={!request}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, getRejectStatus(request))}
                    >
                        {statusBeingSubmit === getRejectStatus(request) && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Set to " + getRejectStatus(request)}
                    </Button>
                }
                {userCanReview &&
                    <Button className="ml-2"
                        disabled={!request}
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => updateStatus(e, getNextStatus(request))}
                    >
                        {statusBeingSubmit === getNextStatus(request) && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Set to " + getNextStatus(request)}
                    </Button>
                }
            </Row>
            <RequestSpinner show={statusBeingSubmit !== undefined} displayText="Updating Request..." />
        </Container>
    );

}