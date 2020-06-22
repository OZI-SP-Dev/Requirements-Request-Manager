import React, { useState } from "react";
import { Col, Container, Form } from "react-bootstrap";
import { getEmptyRequirementsRequest, IRequirementsRequest, RequirementTypes } from "../../api/DomainObjects";
import { PeoplePicker, SPPersona } from "../PeoplePicker/PeoplePicker";

export const RequestForm: React.FunctionComponent<any> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(getEmptyRequirementsRequest());

    const updateRequest = (fieldUpdating: string, newValue: any): void => {
        console.log(`Updating ${fieldUpdating} with`);
        console.log(newValue);
        setRequest({ ...request, [fieldUpdating]: newValue });
    }

    return (
        <Container>
            <h1>New Request</h1>
            <Form>
                <Form.Group>
                    <Form.Label>Requester Org Symbol</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your Org Symbol"
                        value={request.RequesterOrgSymbol}
                        onChange={e => updateRequest('RequesterOrgSymbol', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Requester DSN #</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your DSN Phone Number"
                        value={request.RequesterDSNPhone}
                        onChange={e => updateRequest('RequesterDSNPhone', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Requester Comm #</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your Commercial Phone Number"
                        value={request.RequesterCommPhone}
                        onChange={e => updateRequest('RequesterCommPhone', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>2 Ltr/PEO to Approve:</Form.Label>
                    <Form.Control
                        as={PeoplePicker}
                        updatePeople={(p: SPPersona[]) => {
                            let persona = p[0];
                            updateRequest('ApprovingPEO', { Id: persona.SPUserId, Title: persona.text, Email: persona.Email });
                        }}
                        readOnly={false}
                        required={true}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>PEO Org Symbol</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Approving PEO's Org Symbol"
                        value={request.PEOOrgSymbol}
                        onChange={e => updateRequest('PEOOrgSymbol', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>PEO DSN #</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Approving PEO's DSN Phone Number"
                        value={request.PEO_DSNPhone}
                        onChange={e => updateRequest('PEO_DSNPhone', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>PEO Comm #</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Approving PEO's Commercial Phone Number"
                        value={request.PEO_CommPhone}
                        onChange={e => updateRequest('PEO_CommPhone', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Requirement Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title of the Requirement being requested"
                        value={request.Title}
                        onChange={e => updateRequest('Title', e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Col>
                        <Form.Label>Requirement Type:</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check inline label={RequirementTypes.NEW_CAP} type="radio" id="new-capability-radio"
                            checked={request.RequirementType === RequirementTypes.NEW_CAP}
                            onClick={() => updateRequest("RequirementType", RequirementTypes.NEW_CAP)}
                        />
                        <Form.Check inline label={RequirementTypes.MOD_EXISTING_CAP} type="radio" id="modification-radio"
                            checked={request.RequirementType === RequirementTypes.MOD_EXISTING_CAP}
                            onClick={() => updateRequest("RequirementType", RequirementTypes.MOD_EXISTING_CAP)}
                        />
                        <Form.Check inline label={RequirementTypes.FUNCTIONAL} type="radio" id="functional-radio"
                            checked={request.RequirementType === RequirementTypes.FUNCTIONAL}
                            onClick={() => updateRequest("RequirementType", RequirementTypes.FUNCTIONAL)}
                        />
                        <Form.Check inline label={RequirementTypes.NON_FUNCTIONAL} type="radio" id="non-functional-radio"
                            checked={request.RequirementType === RequirementTypes.NON_FUNCTIONAL}
                            onClick={() => updateRequest("RequirementType", RequirementTypes.NON_FUNCTIONAL)}
                        />
                    </Col>
                </Form.Group>
            </Form>
        </Container>);
}