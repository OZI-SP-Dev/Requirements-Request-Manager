import { FunctionComponent } from "react";
import React from "react";
import { Col, Alert } from "react-bootstrap";


export interface IDismissableErrorAlertProps {
    show: boolean,
    header: string,
    message: string,
    onClose: () => void
}

export const DismissableErrorAlert: FunctionComponent<IDismissableErrorAlertProps> = (props) => {
    return (
        props.show ?
            <Col className="mt-3 fixed-bottom"
                xl={{ span: 6, offset: 3 }}
                lg={{ span: 6, offset: 3 }}
                md={{ span: 8, offset: 2 }}
                sm={{ span: 10, offset: 1 }}
                xs={12}
            >
                <Alert variant="danger" onClose={props.onClose} dismissible>
                    <Alert.Heading>{props.header}</Alert.Heading>
                    <p>{props.message}</p>
                </Alert>
            </Col> : <></>
    );
}