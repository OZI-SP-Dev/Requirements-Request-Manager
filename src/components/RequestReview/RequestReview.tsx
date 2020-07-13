import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { RequestView } from "../RequestView/RequestView";


export interface IRequestReviewProps {
    request?: IRequirementsRequestCRUD
}

export const RequestReview: React.FunctionComponent<IRequestReviewProps> = (props) => {

    // Scroll to the top of the page when navigating to the RequestForm page
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [])

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>View Request</h1>
            <RequestView request={props.request} />
        </Container>
    );

}