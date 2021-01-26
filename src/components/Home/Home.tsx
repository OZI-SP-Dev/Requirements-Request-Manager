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
                                Welcome to AFLCMC Requirement Request Form site. This online Form will begin the process for your requirement request. Please read the instructions below to complete the Form.<br /><br />
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
                        <p>
                            You will need to work with your 2-Ltr Deputy/POC on the Requirements Form for signature prior to submission. Please DO NOT have your 2-Ltr Deputy/POC sign the Form until it is fully complete. Once Form is signed – all fields will be locked and content cannot be edited. <br />
                        </p>
                        <ul>
                            <li>Complete names, org symbols, email addresses and phone numbers</li>
                            <li>Enter Requirement Name</li>
                            <li>Select Requirement Type - new capability or modification to an existing capability</li>
                            <li>Please mark if funding is available – <strong><i>this is very important</i></strong></li>
                            <ul><li>If funding is available, please enter org funding your requirement</li></ul>
                            <li>Select the application needed, if not listed, select other and complete the field</li>
                            <li>Select Projected Organization(s) Impacted</li>
                            <li>Provide Projected Number of Impacted Users – if unknown leave blank</li>
                            <li>Enter Operational Need Date</li>
                            <li>Select Organization’s Priority and provide Priority Explanation</li>
                            <li>Business Objective Field – <i>what business problem is the requirement trying to solve?</i></li>
                            <li>Define Functional Requirements – <i>Something you need the system to do</i></li>
                            <li>Explain Benefits the capability will bring to an organization, cost savings, efficiency, etc.</li>
                            <li>Identify Risks to the business if requirement is not implemented</li>
                            <li>Additional Information to Support Request – provide additional information as needed to support requirement approval and prioritization through the Infrastructure Resource (IRM) Group, chaired by AFLCMC/XP-OZ and consisting of Deputy Director Membership</li>
                            <li>Once you and your 2-Ltr Deputy/POC agree on content, sign and submit</li>
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
                            <li>Requirement is presented to the IRM Group, chaired by AFLCMC/XP-OZ and consists of 2-Ltr Deputy/POC, Directorates, 66th and 88th ABWs, and SMEs as required – <i>every 4 weeks</i></li>
                            <li>AFLCMC Chief Information Technology Officer presents to Functional Management Group (FMG), chaired by SAF/AQX – <i>every 6 months</i></li>
                            <li>One month after the FMG, Requirements Review Board (RRB) will decide which requirements will be placed on contract</li>
                            <li>One month after the RRB – Tools & Training Council (T2C) meets to approve funded requirements</li>
                        </ul>
                    </Card.Text>
                </Card>
            </Row>
        </Container>
    )
}