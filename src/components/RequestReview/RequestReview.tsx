import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { IRequirementsRequestCRUD, RequirementsRequest, IRequirementsRequest } from "../../api/DomainObjects";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { UserContext } from "../../providers/UserProvider";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { RequestView } from "../RequestView/RequestView";
import "./RequestReview.css";


export interface IRequestReviewProps {
    requestId?: number,
    fetchRequestById?: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    // if not provided, this will be treated as a read-only view
    submitApproval?: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    const { user, roles } = useContext(UserContext);

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [comment, setComment] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [userCanReview, setUserCanReview] = useState<boolean>(false);

    const history = useHistory();

    useScrollToTop();

    const getRequest = async () => {
        if (props.requestId !== undefined && props.fetchRequestById) {
            let newRequest = await props.fetchRequestById(props.requestId);
            if (newRequest) {
                setRequest(newRequest);
                setUserCanReview(checkIfUserCanReview(newRequest));
            } else {
                history.push("/Requests");
            }
        }
    }

    const checkIfUserCanReview = (request: IRequirementsRequest): boolean => {
        return props.submitApproval !== undefined && user !== undefined && request !== undefined && !request.PEOApprovedDateTime && user.Id === request.ApprovingPEO.Id;
    }

    // We need to update the state's request whenever the props.editRequest changes because the requests may not have loaded yet
    useEffect(() => {
        getRequest(); // eslint-disable-next-line
    }, [props.requestId])

    useEffect(() => {
        setUserCanReview(checkIfUserCanReview(request)); // eslint-disable-next-line
    }, [user, props.submitApproval])

    const updateComment = (value: string): void => {
        setComment(value);
    }

    const approveRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        try {
            setSubmitting(true);
            if (request && props.submitApproval) {
                await props.submitApproval(request, comment);
            }
            redirect(e, "/Requests");
        } catch (e) {
            console.error("Error while approving Request on Review page");
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }

    const redirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, route: string) => {
        e.preventDefault();
        history.push(route);
    }

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>{userCanReview ? "Review" : "View"} Request</h1>
            <RequestView request={request} />
            <hr />
            {userCanReview &&
                <Form>
                    <Row className="m-2">
                        <Form.Label className="review-form" column xl="3" lg="3" md="2" sm="2" xs="3">
                            <strong>Comment (Optional):</strong>
                        </Form.Label>
                        <Col className="review-form review-vertical-align" xl="9" lg="9" md="10" sm="10" xs="9">
                            <Form.Control
                                type="text"
                                placeholder="Optional comment about approval"
                                value={comment}
                                onChange={e => updateComment(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>}
            <Row className="review-vertical-align m-2">
                <Col>
                    {userCanReview &&
                        <Button className="float-right" disabled={!request} onClick={approveRequest}>
                            {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}{"Approve Request"}
                        </Button>
                    }
                    {request && !request.isReadOnly(user, roles) &&
                        <Button className="float-right mr-2" variant="warning"
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect(e, `/Requests/Edit/${request.Id}`)}
                        >
                            Edit Request
                        </Button>}
                    <Button className="float-right mr-2" variant="secondary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect(e, "/Requests")}
                    >
                        {userCanReview ? "Cancel" : "Close"}
                    </Button>
                </Col>
            </Row>
            <RequestSpinner show={submitting} displayText="Approving Request..." />
        </Container>
    );

}