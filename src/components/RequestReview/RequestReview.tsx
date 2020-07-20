import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Form, Spinner, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { RequestView } from "../RequestView/RequestView";
import "./RequestReview.css";
import { UserContext } from "../../providers/UserProvider";


export interface IRequestReviewProps {
    request?: IRequirementsRequestCRUD,
    // if not provided, this will be treated as a read-only view
    submitApproval?: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    const { user } = useContext(UserContext);

    const checkIfUserCanReview = (): boolean => {
        return props.submitApproval !== undefined && user !== undefined && props.request !== undefined && !props.request.PEOApprovedDateTime && user.Id === props.request.ApprovingPEO.Id;
    }

    const [comment, setComment] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [userCanReview, setUserCanReview] = useState<boolean>(checkIfUserCanReview());

    const history = useHistory();

    useScrollToTop();

    useEffect(() => {
        setUserCanReview(checkIfUserCanReview()); // eslint-disable-next-line
    }, [user, props.submitApproval])

    const updateComment = (value: string): void => {
        setComment(value);
    }

    const approveRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        setSubmitting(true);
        if (props.request && props.submitApproval) {
            await props.submitApproval(props.request, comment);
        }
        setSubmitting(false);
        redirect(e, "/Requests");
    }

    const redirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, route: string) => {
        e.preventDefault();
        history.push(route);
    }

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>{userCanReview ? "Review" : "View"} Request</h1>
            <RequestView request={props.request} />
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
                        <Button className="float-right" disabled={!props.request} onClick={approveRequest}>
                            {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}{"Approve Request"}
                        </Button>
                    }
                    <Button className="float-right mr-2" variant="warning"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect(e, `/Requests/Edit/${props.request?.Id}`)}
                    >
                        Edit Request
                    </Button>
                    <Button className="float-right mr-2" variant="secondary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect(e, "/Requests")}
                    >
                        {userCanReview ? "Cancel" : "Close"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );

}