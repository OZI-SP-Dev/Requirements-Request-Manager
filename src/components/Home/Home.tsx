import React from "react";
import { FunctionComponent } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useRedirect } from "../../hooks/useRedirect";


export const Home: FunctionComponent = () => {

    const { redirect } = useRedirect();

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>Requirements Requests Manager</h1>
            <Row className="m-2 mt-4">
                <Button className="m-2 ml-auto" variant="primary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect("/Requests", e)}
                >
                    My Requests
                </Button>
                <Button className="m-2" variant="primary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => redirect("/Requests/New", e)}
                >
                    New Request
                </Button>
            </Row>
            <Row className="m-3">
                <Card className="m-auto p-0" as={Col} md='8' sm='10' xs='12'>
                    <Card.Header><Card.Title>Site Overview</Card.Title></Card.Header>
                    <Card.Text>
                        Here shall lie the description of the application and any high level information that the users should know before using it.
                    </Card.Text>
                </Card>
            </Row>
            <Row className="m-3">
                <Card className="m-auto p-0" as={Col} md='8' sm='10' xs='12'>
                    <Card.Header><Card.Title>Form Help</Card.Title></Card.Header>
                    <Card.Text>
                        Here shall lie descriptions of each field on the form to help the users fill out the request form.
                    </Card.Text>
                </Card>
            </Row>
            <Row className="m-3">
                <Card className="m-auto p-0" as={Col} md='8' sm='10' xs='12'>
                    <Card.Header><Card.Title>Approval Workflow</Card.Title></Card.Header>
                    <Card.Text>
                        Here shall lie descriptions of the workflow of the request after it has been submitted. Including steps for approval and what happens after that.
                    </Card.Text>
                </Card>
            </Row>
        </Container>
    )
}