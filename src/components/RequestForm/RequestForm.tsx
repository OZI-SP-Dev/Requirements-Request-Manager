import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { getEmptyRequirementsRequest, IRequirementsRequest, RequirementTypes, ApplicationTypes, Centers } from "../../api/DomainObjects";
import { PeoplePicker, SPPersona } from "../PeoplePicker/PeoplePicker";
import './RequestForm.css'

export const RequestForm: React.FunctionComponent<any> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequest>(getEmptyRequirementsRequest());
    const [showFundingField, setShowFundingField] = useState<boolean>(false);

    const updateRequest = (fieldUpdating: string, newValue: any): void => {
        setRequest({ ...request, [fieldUpdating]: newValue });
    }

    const flipShowFundingField = (): void => {
        setShowFundingField(!showFundingField);
    }

    return (
        <Container className="pb-5 pt-3">
            <h1>New Request</h1>
            <Form className="request-form m-3">
                <Form.Row className="mb-3">
                    <Col>
                        <Form.Label>Requester Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Org Symbol"
                            value={request.RequesterOrgSymbol}
                            onChange={e => updateRequest('RequesterOrgSymbol', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Requester DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your DSN Phone Number"
                            value={request.RequesterDSNPhone}
                            onChange={e => updateRequest('RequesterDSNPhone', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Requester Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Commercial Phone Number"
                            value={request.RequesterCommPhone}
                            onChange={e => updateRequest('RequesterCommPhone', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col>
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
                    </Col>
                    <Col>
                        <Form.Label>PEO Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Org Symbol"
                            value={request.PEOOrgSymbol}
                            onChange={e => updateRequest('PEOOrgSymbol', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col>
                        <Form.Label>PEO DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's DSN Phone Number"
                            value={request.PEO_DSNPhone}
                            onChange={e => updateRequest('PEO_DSNPhone', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>PEO Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Commercial Phone Number"
                            value={request.PEO_CommPhone}
                            onChange={e => updateRequest('PEO_CommPhone', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Form.Label>Requirement Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title of the Requirement being requested"
                        value={request.Title}
                        onChange={e => updateRequest('Title', e.target.value)}
                    />
                </Form.Row>
                <Form.Row className="mb-3">
                    <Form.Label className="mr-3 mb-0">Requirement Type:</Form.Label>
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
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col>
                        <Form.Check inline label="Is Requirement Funded?" type="checkbox" id="funded-checkbox"
                            checked={showFundingField}
                            onClick={flipShowFundingField}
                        />
                    </Col>
                    {showFundingField &&
                        <Col>
                            <Form.Label>If Yes, Org/PEO funding it:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Org/PEO Funding the Requirement"
                                value={request.FundingOrgOrPEO}
                                onChange={e => updateRequest('FundingOrgOrPEO', e.target.value)}
                            />
                        </Col>
                    }
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col>
                        <Form.Label>Application Needed:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ApplicationNeeded}
                            onChange={e => updateRequest('ApplicationNeeded', e.target.value)}
                        >
                            {Object.values(ApplicationTypes).map(type => <option>{type}</option>)}
                        </Form.Control>
                    </Col>
                    {request.ApplicationNeeded === ApplicationTypes.OTHER &&
                        <Col>
                            <Form.Label>If Other, please name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Other Application Needed"
                                value={request.OtherApplicationNeeded}
                                onChange={e => updateRequest('OtherApplicationNeeded', e.target.value)}
                            />
                        </Col>
                    }
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col><Form.Label>Projected Organizations Impacted:</Form.Label></Col>
                    <Col>
                        <Form.Check inline label="Enterprise" type="checkbox" id="enterprise-checkbox"
                            checked={request.IsProjectedOrgsEnterprise}
                            onClick={() => updateRequest('IsProjectedOrgsEnterprise', !request.IsProjectedOrgsEnterprise)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Center:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ProjectedOrgsImpactedCenter}
                            onChange={e => updateRequest('ProjectedOrgsImpactedCenter', e.target.value)}
                        >
                            {Object.values(Centers).map(center => <option>{center}</option>)}
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Org:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Project Org Impacted"
                            value={request.ProjectedOrgsImpactedOrg}
                            onChange={e => updateRequest('ProjectedOrgsImpactedOrg', e.target.value)}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </Container>);
}