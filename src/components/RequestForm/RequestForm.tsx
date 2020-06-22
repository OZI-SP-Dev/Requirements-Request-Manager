import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { getEmptyRequirementsRequest, IRequirementsRequest } from "../../api/DomainObjects";

export const RequestForm: React.FunctionComponent<any> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(getEmptyRequirementsRequest());

    const updateRequest = (fieldUpdating: string, newValue: any): void => {
        setRequest({ ...request, [fieldUpdating]: newValue });
    }

    return (
    <Form>
        <Form.Group>
            
        </Form.Group>
    </Form>);
}