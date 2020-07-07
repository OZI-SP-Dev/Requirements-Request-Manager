import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";
import { Link } from "react-router-dom";
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from "../../api/RequirementsRequestsApi";

export function useRequests(): [IRequirementsRequestCRUD[], (request: IRequirementsRequestCRUD) => void] {
    const [requests, setRequests] = useState<IRequirementsRequestCRUD[]>([]);
    const api: IRequirementsRequestApi = RequirementsRequestsApiConfig.getApi();

    const updateRequests = (request: IRequirementsRequestCRUD) => {
        let newRequests = requests;
        let oldRequestIndex = newRequests.findIndex(req => req.Id === request.Id);
        if (oldRequestIndex > -1) {
            newRequests[oldRequestIndex] = request;
        } else {
            newRequests.push(request);
        }
        setRequests(newRequests);
    }

    const fetchRequests = async () => {
        setRequests(await api.fetchRequirementsRequests())
    }

    useEffect(() => {
        fetchRequests(); // eslint-disable-next-line
    }, []);

    return ([requests, updateRequests]);
}

export const Requests: React.FunctionComponent = () => {

    const [requests, updateRequests] = useRequests();

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
                    {requests.map(request =>
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