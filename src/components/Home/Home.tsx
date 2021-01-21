import React, { FunctionComponent } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import './Home.css';


export const Home: FunctionComponent = () => {

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>AFLCMC Requirement Request Form</h1>
            <Row className="m-3">
                <Col className="m-auto p-0" lg='9' sm='10' xs='12'>
                    <Row className="mt-3 mb-3 mr-0">
                        <Button className="mr-2 ml-auto" variant="primary" href="#/Requests">
                            My Requests
                        </Button>
                        <Button className="ml-2" variant="primary" href="#/Requests/New">
                            New Request
                        </Button>
                    </Row>
                    <Card>
                        <Card.Header><Card.Title>Site Introduction</Card.Title></Card.Header>
                        <Card.Text>
                            <p>
                                Welcome to AFLCMC/XP-OZ/OZI’s Requirement Request Form site. This online Form will begin the process for your requirement request. Please read the instructions below to complete the Form. <br /><br />
                                You will need to work with your 2 Ltr Deputy or an assigned POC on the Requirements Form for signature prior to submission. Please <strong>DO NOT</strong> have your 2 Ltr Deputy/POC sign the Form until it is fully complete. Once Form is signed – all fields will be locked and content cannot be revised.<br /><br />
                                Requirements Manager is{' '}<a href="mailto:jacqueline.williams.17@us.af.mil"><u>Jackie Williams AFLCMC/XP-OZ/OZI</u></a>
                            </p>
                        </Card.Text>
                    </Card>
                </Col>
            </Row>
            <Row className="m-3">
                <Card className="m-auto p-0" as={Col} lg='9' sm='10' xs='12'>
                    <Card.Header><Card.Title>Form Instructions</Card.Title></Card.Header>
                    <Card.Text>
                        <p>Work with your 2 Ltr Deputy/POC on the Requirements Form – DO NOT have your 2 Ltr Deputy/POC sign until Form is complete. Once this Form is signed – all fields will be locked and content cannot be revised.<br /></p>
                        <ul>
                            <li>Complete names, org symbols, email addresses and phone numbers</li>
                            <li>Requirement Name</li>
                            <li>Requirement Type: new capability or modification to an existing capability within an existing application</li>
                            <li>Please mark if funding is available – <strong><i>this is very important</i></strong></li>
                            <ul><li>If funding is available, please state org funding requirement</li></ul>
                            <li>Select the application needed, if not listed, select other and complete the field</li>
                            <li>Enter the Organization(s) being impacted</li>
                            <li>Provide an approximate number of impacted users – if unknown leave blank</li>
                            <li>Operation date requirement is needed to be available</li>
                            <li>Select a Priority and provide reason</li>
                            <li>Business Requirement Field – <i>What problem is the business trying to solve?</i></li>
                            <li>Functional Requirement – <i>Something you need the system to do</i></li>
                            <li>Benefits the capability will bring to an organization, cost savings, efficiency, etc.</li>
                            <li>Risk to the business if requirement is not implemented</li>
                            <li>Additional information to Support Request – provide information not asked that you believe will move requirement for approval and prioritization through the Infrastructure Resource (IRM) Group chaired by the AFLCMC/XP-OZ and consisting of Dep Directors</li>
                            <li>Once you and your 2 Ltr/POC agree on content, sign and submit</li>
                        </ul>
                    </Card.Text>
                </Card>
            </Row>
            <Row className="m-3">
                <Card className="m-auto p-0" as={Col} lg='9' sm='10' xs='12'>
                    <Card.Header><Card.Title>Request Timeline</Card.Title></Card.Header>
                    <Card.Text>
                        <ul>
                            <li>Requirements Manager Receives/Reviews Form</li>
                            <ul><li>Requirements Manager sets up conversation time with requestor and POC to discuss requirement</li></ul>
                            <li>Requirement is presented to the IRM Group, chaired by AFLCMC/XP-OZ and consists of 2Ltr Deputy/POC, Directorates, 66th and 88th ABWs, and SMEs as required – <i>every 4 weeks</i></li>
                            <li>AFLCMC/XP-OZ/OZI Chief Information Technology Officer presents to Functional Management Group, chaired by SAF/AQX – <i>every 6 months</i></li>
                            <li>One month later – Requirements Review Board, this board will tell us which requirements have funding to proceed to be placed on contract for development and implementation</li>
                            <ul><li>Requestor and POC will be informed of the status of their requirement</li></ul>
                            <li>One month later – T2C meets to approve on funded requirements</li>
                            <ul><li>Requestor and POC will be informed of the status of their requirement</li></ul>
                        </ul>
                    </Card.Text>
                </Card>
            </Row>
        </Container>
    )
}