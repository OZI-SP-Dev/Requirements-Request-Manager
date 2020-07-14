import React from "react";
import { Container } from "react-bootstrap";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { RequestView } from "../RequestView/RequestView";


export interface IRequestReviewProps {
    request?: IRequirementsRequestCRUD
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    useScrollToTop();

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>View Request</h1>
            <RequestView request={props.request} />
        </Container>
    );

}