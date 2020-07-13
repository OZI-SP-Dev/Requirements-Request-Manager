import { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Spinner } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { ApplicationTypes, Centers, IRequirementsRequestCRUD, OrgPriorities, RequirementsRequest, RequirementTypes, IRequirementsRequest } from "../../api/DomainObjects";
import { Person, IPerson } from "../../api/UserApi";
import { UserContext } from "../../providers/UserProvider";
import { CustomInputeDatePicker } from "../CustomInputDatePicker/CustomInputDatePicker";
import { PeoplePicker } from "../PeoplePicker/PeoplePicker";
import './RequestForm.css';

export interface IRequestFormProps {
    editRequest?: IRequirementsRequest,
    submitRequest: (request: IRequirementsRequestCRUD) => Promise<void>
}

export const RequestForm: React.FunctionComponent<IRequestFormProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [showFundingField, setShowFundingField] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    const { user } = useContext(UserContext);
    const history = useHistory();

    // Scroll to the top of the page when navigating to the RequestForm page
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [])

    // We need to update the state's request whenever the props.editRequest changes because the requests may not have loaded yet
    useEffect(() => {
        setRequest(new RequirementsRequest(props.editRequest));
    }, [props.editRequest])

    useEffect(() => {
        // only update the requester if this is a new request
        if (request.Id < 0) {
            updateRequest('Requester', user ? user : new Person({ Id: -1, Title: "Loading User", EMail: "" }));
        }
        // eslint-disable-next-line
    }, [user])

    const updateRequest = (fieldUpdating: string, newValue: string | number | boolean | Moment | Person): void => {
        setRequest(new RequirementsRequest({ ...request, [fieldUpdating]: newValue }));
    }

    const getNumbersOnly = (input: string): string => {
        return input.replace(new RegExp("[^0-9]"), "");
    }

    const updatePhoneField = (fieldUpdating: string, newValue: string): void => {
        let phoneNumber = getNumbersOnly(newValue);
        if (phoneNumber.length <= 10) {
            updateRequest(fieldUpdating, phoneNumber);
        }
    }

    const flipShowFundingField = (): void => {
        setShowFundingField(!showFundingField);
    }

    const submitRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        await props.submitRequest(request);
        setSaving(false);
        history.push("/Requests");
    }

    return (
        <Container className="pb-5 pt-3">
            <h1>{request.Id > -1 ? "Edit" : "New"} Request</h1>
            <Form className="request-form m-3" onSubmit={submitRequest}>
                <Form.Row>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Org Symbol"
                            value={request.RequesterOrgSymbol}
                            onChange={e => updateRequest('RequesterOrgSymbol', e.target.value)}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your DSN Phone Number"
                            value={request.RequesterDSNPhone}
                            onChange={e => updatePhoneField('RequesterDSNPhone', getNumbersOnly(e.target.value))}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Commercial Phone Number"
                            value={request.RequesterCommPhone}
                            onChange={e => updatePhoneField('RequesterCommPhone', getNumbersOnly(e.target.value))}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label>2 Ltr/PEO to Approve:</Form.Label>
                        <Form.Control
                            as={PeoplePicker}
                            defaultValue={request.ApprovingPEO.Title ? [request.ApprovingPEO] : undefined}
                            updatePeople={(p: IPerson[]) => {
                                let persona = p[0];
                                updateRequest('ApprovingPEO', persona ? new Person(persona) : new Person());
                            }}
                            readOnly={false}
                            required={true}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="4" sm="6" xs="12">
                        <Form.Label>PEO Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Org Symbol"
                            value={request.PEOOrgSymbol}
                            onChange={e => updateRequest('PEOOrgSymbol', e.target.value)}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label>PEO DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's DSN Phone Number"
                            value={request.PEO_DSNPhone}
                            onChange={e => updatePhoneField('PEO_DSNPhone', getNumbersOnly(e.target.value))}
                        />
                    </Col>
                    <Col xl={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 2 }} md="6" sm="6" xs="12">
                        <Form.Label>PEO Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Commercial Phone Number"
                            value={request.PEO_CommPhone}
                            onChange={e => updatePhoneField('PEO_CommPhone', getNumbersOnly(e.target.value))}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label>Requirement Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title of the Requirement being requested"
                            value={request.Title}
                            onChange={e => updateRequest('Title', e.target.value)}
                        />
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0">Requirement Type:</Form.Label>
                        {Object.values(RequirementTypes).map(type =>
                            <Form.Check key={type} inline label={type} type="radio" id={`${type}-radio`}
                                checked={request.RequirementType === type}
                                onChange={() => updateRequest("RequirementType", type)}
                            />)
                        }
                    </Col>
                    <Col className="mt-4 mb-4" xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Check inline label="Is Requirement Funded?" type="checkbox" id="funded-checkbox"
                            checked={showFundingField}
                            onChange={flipShowFundingField}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {showFundingField &&
                            <>
                                <Form.Label>If Yes, Org/PEO funding it:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Org/PEO Funding the Requirement"
                                    value={request.FundingOrgOrPEO}
                                    onChange={e => updateRequest('FundingOrgOrPEO', e.target.value)}
                                />
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label>Application Needed:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ApplicationNeeded}
                            onChange={e => updateRequest('ApplicationNeeded', e.target.value)}
                        >
                            {Object.values(ApplicationTypes).map(type => <option key={type}>{type}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {request.ApplicationNeeded === ApplicationTypes.OTHER &&
                            <>
                                <Form.Label>If Other, please name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Other Application Needed"
                                    value={request.OtherApplicationNeeded}
                                    onChange={e => updateRequest('OtherApplicationNeeded', e.target.value)}
                                />
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col className="request-vertical-center" xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Projected Organizations Impacted:</Form.Label>
                    </Col>
                    <Col className="request-vertical-center" xl="2" lg="3" md="6" sm="6" xs="12">
                        <Form.Check inline label="Is Enterprise?" type="checkbox" id="enterprise-checkbox"
                            checked={request.IsProjectedOrgsEnterprise}
                            onChange={() => updateRequest('IsProjectedOrgsEnterprise', !request.IsProjectedOrgsEnterprise)}
                        />
                    </Col>
                    <Col xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Impacted Center:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ProjectedOrgsImpactedCenter}
                            onChange={e => updateRequest('ProjectedOrgsImpactedCenter', e.target.value)}
                        >
                            {Object.values(Centers).map(center => <option key={center}>{center}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Impacted Org:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Projected Org Impacted"
                            value={request.ProjectedOrgsImpactedOrg}
                            onChange={e => updateRequest('ProjectedOrgsImpactedOrg', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="5" lg="6" md="6" sm="6" xs="12">
                        <Form.Label>Projected Number of Impacted Users:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Number of Users Impacted by the Requested Application"
                            value={request.ProjectedImpactedUsers ? request.ProjectedImpactedUsers : ''}
                            onChange={e => updateRequest("ProjectedImpactedUsers", parseInt(getNumbersOnly(e.target.value)))}
                        />
                    </Col>
                    <Col xl="3" lg="4" md="4" sm="4" xs="12">
                        <CustomInputeDatePicker
                            headerText="Operational Need Date:"
                            date={request.OperationalNeedDate}
                            onChange={date => updateRequest('OperationalNeedDate', date)}
                        />
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0">Organization's Priority:</Form.Label>
                        <Form.Check inline
                            label={<>{OrgPriorities.HIGH} <span className="subtext">(Essential to Deliver)</span></>}
                            type="radio"
                            id={"high-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.HIGH}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.HIGH)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.MEDIUM} <span className="subtext">(Functional Capabilities Enhancements)</span></>}
                            type="radio"
                            id={"medium-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.MEDIUM}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.MEDIUM)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.LOW} <span className="subtext">(Desire to have/worth Implementing)</span></>}
                            type="radio"
                            id={"low-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.LOW}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.LOW)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>Priority Explanation:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Detailed explanation for the priority given..."
                            value={request.PriorityExplanation}
                            onChange={e => updateRequest('PriorityExplanation', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Business Objective: <span className="subtext">(What problem is the business trying to solve?)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="Detailed explanation of the objective that the business would like this application to achieve..."
                            value={request.BusinessObjective}
                            onChange={e => updateRequest('BusinessObjective', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Functional Requirements: <span className="subtext">(System capabilities for users to perform job efficiently)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="The system shall provide the ability to..."
                            value={request.FunctionalRequirements}
                            onChange={e => updateRequest('FunctionalRequirements', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Benefits: <span className="subtext">(Time savings, reduce costs, productivity efficiency, etc.)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Benefits this capability will bring to the organization(s) and/or users..."
                            value={request.Benefits}
                            onChange={e => updateRequest('Benefits', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Risks: <span className="subtext">(What is the risk if requirement is not approved and implemented)?</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Detailed explanation of what the risks are for the organization if the requirement is not met..."
                            value={request.Risk}
                            onChange={e => updateRequest('Risk', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Additional Information to Support Request: <span className="subtext">(Optional)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder="Any additional information that may be useful when considering this request for approval..."
                            value={request.AdditionalInfo}
                            onChange={e => updateRequest('AdditionalInfo', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Button className="mb-3 ml-2 float-right" variant="primary" onClick={submitRequest}>
                    {saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}{"Submit Request"}
                </Button>
                <Link to="/Requests">
                    <Button className="mb-3 float-right" variant="secondary">
                        Cancel
                    </Button>
                </Link>
            </Form>
        </Container>);
}