import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { Link } from "react-router-dom";

export interface IRequestsProps {
    requests: IRequirementsRequestCRUD[]
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    return (
        <Container className="pb-5 pt-3">
            <h1>Requests</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Requester</th>
                        <th>Title</th>
                        <th>Request Date</th>
                        <th>Requirement Type</th>
                        <th>Application Needed</th>
                        <th>Org Priority</th>
                        <th>Operational Need Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.requests.map(request =>
                        <tr key={request.Id}>
                            <td>{request.Id}</td>
                            <td>{request.Requester.Title}</td>
                            <td>{request.Title}</td>
                            <td>{request.RequestDate.format("DD MMM YYYY")}</td>
                            <td>{request.RequirementType}</td>
                            <td>{request.ApplicationNeeded}</td>
                            <td>{request.OrgPriority}</td>
                            <td>{request.OperationalNeedDate.format("DD MMM YYYY")}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Link to="/Requests/new">
                <Button variant="primary" className="float-left">New Request</Button>
            </Link>
        </Container>
    );
}