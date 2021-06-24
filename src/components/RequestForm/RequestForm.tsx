import { Icon } from "@fluentui/react";
import moment, { Moment } from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, NoveltyRequirementTypes, OrgPriorities, RequestStatuses, RequirementsRequest } from "../../api/DomainObjects";
import { IPerson, Person } from "../../api/UserApi";
import { useRedirect } from "../../hooks/useRedirect";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { UserContext } from "../../providers/UserProvider";
import { IRequestValidation, RequestValidation } from "../../utils/RequestValidation";
import { CustomInputeDatePicker } from "../CustomInputDatePicker/CustomInputDatePicker";
import { DismissableErrorAlert } from "../DismissableErrorAlert/DismissableErrorAlert";
import { PeoplePicker } from "../PeoplePicker/PeoplePicker";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import './RequestForm.css';

export interface IRequestFormProps {
    editRequestId?: number,
    fetchRequestById?: (requestId: number) => Promise<IRequirementsRequestCRUD | undefined>,
    submitRequest: (request: IRequirementsRequestCRUD, saveWithoutSubmitting?: boolean) => Promise<IRequirementsRequest>
}

export const RequestForm: React.FunctionComponent<IRequestFormProps> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [oldRequest, setOldRequest] = useState<IRequirementsRequest>();
    const [validation, setValidation] = useState<IRequestValidation | undefined>();
    const [showFundingField, setShowFundingField] = useState<boolean>();
    const [approverSameAsRequester, setApproverSameAsRequester] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const userContext = useContext(UserContext);
    const { redirect, pushRoute } = useRedirect();

    useScrollToTop();

    const getRequest = async () => {
        try {
            if (props.editRequestId !== undefined && props.fetchRequestById) {
                let newRequest = await props.fetchRequestById(props.editRequestId);
                if (newRequest) {
                    setReadOnly(newRequest.isReadOnly(userContext.user, userContext.roles));
                    setApproverSameAsRequester(newRequest.Requester.Id === newRequest.Approver.Id);
                    setShowFundingField(newRequest.FundingOrgOrDeputy !== "" && newRequest.FundingOrgOrDeputy !== undefined && newRequest.FundingOrgOrDeputy !== null);
                    setRequest(newRequest);
                    // copy that doesn't get changed to pass to the validator
                    setOldRequest(newRequest);
                } else {
                    redirect("/Requests");
                }
            }
        } catch (e) {
            console.error("Error trying to fetch Request for Request Form");
            console.error(e);
        }
    }

    // We need to update the state's request whenever the props.editRequest changes because the requests may not have loaded yet
    useEffect(() => {
        getRequest(); // eslint-disable-next-line
    }, [props.editRequestId]);

    useEffect(() => {
        setReadOnly(request.isReadOnly(userContext.user, userContext.roles));
        // only update the requester if this is a new request
        if (request.Id < 0) {
            updateRequest('Requester', userContext.user ? userContext.user : new Person({ Id: -1, Title: "Loading User", EMail: "" }));
        } // eslint-disable-next-line
    }, [userContext]);

    useEffect(() => {
        let userOrgIndex = request.Requester.Title.search(new RegExp("\\w+/\\w+$"));
        if (userOrgIndex >= 0) {
            updateRequest('RequesterOrgSymbol', request.Requester.Title.substr(userOrgIndex));
        } // eslint-disable-next-line
    }, [request.Requester.Title]);

    useEffect(() => {
        let userOrgIndex = request.Approver.Title.search(new RegExp("\\w+/\\w+$"));
        if (userOrgIndex >= 0) {
            updateRequest('ApproverOrgSymbol', request.Approver.Title.substr(userOrgIndex));
        } // eslint-disable-next-line
    }, [request.Approver.Title]);

    useEffect(() => {
        // Update validation whenever a field changes after a submission attempt
        if (validation) {
            setValidation(validation.IsShortValidation ? RequestValidation.getShortValidation(request) : RequestValidation.getValidation(request, showFundingField));
        } // eslint-disable-next-line
    }, [request, showFundingField]);

    const updateRequest = (fieldUpdating: string, newValue: string | number | boolean | Moment | IPerson | null): void => {
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

    const flipPeoSameAsRequester = (): void => {
        setApproverSameAsRequester(!approverSameAsRequester);
    }

    const buildSubmittableRequest = (): RequirementsRequest => {
        let req = new RequirementsRequest(request);
        if (approverSameAsRequester) {
            req.Approver = req.Requester;
            req.ApproverOrgSymbol = req.RequesterOrgSymbol;
            req.ApproverDSNPhone = req.RequesterDSNPhone;
            req.ApproverCommPhone = req.RequesterCommPhone;
        }
        if (!showFundingField) {
            req.FundingOrgOrDeputy = "";
        }
        return req;
    }

    const submitRequest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>, saveWithoutSubmitting?: boolean) => {
        try {
            e.preventDefault();
            setSaving(true);
            let req = buildSubmittableRequest();
            let requestValidation = saveWithoutSubmitting ? RequestValidation.getShortValidation(req) : RequestValidation.getValidation(req, showFundingField);
            if (!requestValidation.IsErrored) {
                pushRoute(`/Requests/Review/${(await props.submitRequest(req, saveWithoutSubmitting)).Id}`, e);
            } else {
                setValidation(requestValidation);
                setError("Please fix the errored fields!");
            }
        } catch (e) {
            console.error("Error trying to submit request from request form");
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    const canSaveWithoutSubmitting = (): boolean => {
        return request.Status === RequestStatuses.SAVED
            || (request.Status === RequestStatuses.SUBMITTED && request.Id < 0);
    }

    return (
        <Container fluid className="pb-5 pt-3">
            <h1>{request.Id > -1 ? "Edit" : "New"} Request</h1>
            <Form className="request-form m-3" onSubmit={submitRequest}>
                <Form.Row>
                    <Col xl="3" lg="4" md="6" sm="6" xs="12">
                        <CustomInputeDatePicker
                            headerText="Requested Date:"
                            readOnly={readOnly}
                            date={request.RequestDate}
                            maxDate={moment()}
                            onChange={date => updateRequest('RequestDate', date)}
                            isValid={validation && !validation.RequestDateError}
                            isInvalid={validation && validation.RequestDateError !== ""}
                            errorMessage={validation ? validation.RequestDateError : ""}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label className="required">Requester (Last Name, First Name):</Form.Label>
                        <Form.Control
                            as={PeoplePicker}
                            defaultValue={request.Requester.Title ? [request.Requester] : undefined}
                            updatePeople={(p: IPerson[]) => {
                                let persona = p[0];
                                updateRequest('Requester', persona ? new Person(persona) : new Person());
                            }}
                            readOnly={readOnly}
                            isInvalid={validation && validation.RequesterError !== ""}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.RequesterError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl="4" lg="4" md="4" sm="6" xs="12">
                        <Form.Label className="required" lg={4} sm={6}>Requester Org Symbol:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Org Symbol"
                            readOnly={readOnly}
                            value={request.RequesterOrgSymbol}
                            onChange={e => updateRequest('RequesterOrgSymbol', e.target.value)}
                            isValid={validation && !validation.RequesterOrgSymbolError}
                            isInvalid={validation && validation.RequesterOrgSymbolError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.RequesterOrgSymbolError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg={4} sm={6}>Requester DSN #:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your DSN Phone Number"
                            readOnly={readOnly}
                            value={request.RequesterDSNPhone ? request.RequesterDSNPhone : ''}
                            onChange={e => updatePhoneField('RequesterDSNPhone', getNumbersOnly(e.target.value))}
                            isValid={validation && !validation.RequesterDSNPhoneError}
                            isInvalid={validation && validation.RequesterDSNPhoneError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.RequesterDSNPhoneError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 2 }} md="6" sm="6" xs="12">
                        <Form.Label className="required" lg={4} sm={6}>Requester Comm #:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Commercial Phone Number"
                            readOnly={readOnly}
                            value={request.RequesterCommPhone}
                            onChange={e => updatePhoneField('RequesterCommPhone', getNumbersOnly(e.target.value))}
                            isValid={validation && !validation.RequesterCommPhoneError}
                            isInvalid={validation && validation.RequesterCommPhoneError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.RequesterCommPhoneError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col className="mt-4" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Check inline label="2 Ltr Deputy Same as Requester?" type="checkbox" id="peo-requester-checkbox"
                            disabled={readOnly}
                            checked={approverSameAsRequester}
                            onChange={flipPeoSameAsRequester}
                        />
                    </Col>
                </Form.Row>
                {!approverSameAsRequester && <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label className="required">2 Ltr Deputy to Approve (Last Name, First Name):
                            <OverlayTrigger
                                delay={{ show: 500, hide: 0 }}
                                overlay={
                                    <Tooltip id="approverTooltip">
                                        This will be the 2 Ltr Deputy for your organization unless they have delegated this authority
							        </Tooltip>
                                }>
                                <Icon iconName='Info' ariaLabel="Info" className="ml-1 align-middle approver-info-icon" />
                            </OverlayTrigger>
                        </Form.Label>
                        <Form.Control
                            as={PeoplePicker}
                            defaultValue={request.Approver.Title ? [request.Approver] : undefined}
                            updatePeople={(p: IPerson[]) => {
                                let persona = p[0];
                                updateRequest('Approver', persona ? new Person(persona) : new Person());
                            }}
                            readOnly={readOnly}
                            required
                            isInvalid={validation && validation.ApproverError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.ApproverError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl="4" lg="4" md="4" sm="6" xs="12">
                        <Form.Label className="required">2 Ltr Deputy Org Symbol:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approver's Org Symbol"
                            readOnly={readOnly}
                            value={request.ApproverOrgSymbol}
                            onChange={e => updateRequest('ApproverOrgSymbol', e.target.value)}
                            isValid={validation && !validation.ApproverOrgSymbolError}
                            isInvalid={validation && validation.ApproverOrgSymbolError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.ApproverOrgSymbolError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label>2 Ltr Deputy DSN #:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approver's DSN Phone Number"
                            readOnly={readOnly}
                            value={request.ApproverDSNPhone ? request.ApproverDSNPhone : ''}
                            onChange={e => updatePhoneField('ApproverDSNPhone', getNumbersOnly(e.target.value))}
                            isValid={validation && !validation.ApproverDSNPhoneError}
                            isInvalid={validation && validation.ApproverDSNPhoneError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.ApproverDSNPhoneError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col xl={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 2 }} md="6" sm="6" xs="12">
                        <Form.Label className="required">2 Ltr Deputy Comm #:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approver's Commercial Phone Number"
                            readOnly={readOnly}
                            value={request.ApproverCommPhone}
                            onChange={e => updatePhoneField('ApproverCommPhone', getNumbersOnly(e.target.value))}
                            isValid={validation && !validation.ApproverCommPhoneError}
                            isInvalid={validation && validation.ApproverCommPhoneError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.ApproverCommPhoneError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>}
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label className="required">Requirement Title:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title of the Requirement being requested"
                            readOnly={readOnly}
                            value={request.Title}
                            onChange={e => updateRequest('Title', e.target.value)}
                            isValid={validation && !validation.TitleError}
                            isInvalid={validation && validation.TitleError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.TitleError : ""}
                        </Form.Control.Feedback>
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0">Requirement Type New or Existing:</Form.Label>
                        {Object.values(NoveltyRequirementTypes).map(type =>
                            <Form.Check key={type} inline label={type} type="radio" id={`${type}-radio`}
                                disabled={readOnly}
                                checked={request.NoveltyRequirementType === type}
                                onChange={() => updateRequest("NoveltyRequirementType", type)}
                            />)
                        }
                    </Col>
                    <Col className="mt-4 mb-1" xl="6" lg="6" md="6" sm="6" xs="12">
                        <Form.Label className="mr-3 required">Requirement Funded? If yes, Funding Org will appear: </Form.Label>
                        <Form.Check inline type="radio" disabled={readOnly} >
                            <Form.Group controlId="funded-radio">
                                <Form.Check.Input type="radio"
                                    id="funded-radio-yes"
                                    disabled={readOnly}
                                    checked={showFundingField}
                                    onChange={() => setShowFundingField(true)}
                                    isValid={validation && !validation.IsFundedCheckError}
                                    isInvalid={validation && validation.IsFundedCheckError !== ""}
                                />
                                <Form.Check.Label htmlFor="funded-radio-yes" className="mr-3">Yes</Form.Check.Label>
                                <Form.Check.Input type="radio"
                                    id="funded-radio-no"
                                    disabled={readOnly}
                                    checked={showFundingField !== undefined && !showFundingField}
                                    onChange={() => setShowFundingField(false)}
                                    isValid={validation && !validation.IsFundedCheckError}
                                    isInvalid={validation && validation.IsFundedCheckError !== ""}
                                />
                                <Form.Check.Label htmlFor="funded-radio-no" className="mr-3">No</Form.Check.Label>
                                <Form.Control.Feedback type="invalid" className="mr-3">
                                    {validation ? validation.IsFundedCheckError : ""}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Check>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {showFundingField &&
                            <>
                                <Form.Label className="required">If Yes, Org/2 Ltr Deputy funding it:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Org/Deputy Funding the Requirement"
                                    readOnly={readOnly}
                                    value={request.FundingOrgOrDeputy}
                                    onChange={e => updateRequest('FundingOrgOrDeputy', e.target.value)}
                                    isValid={validation && !validation.FundingOrgOrDeputyError}
                                    isInvalid={validation && validation.FundingOrgOrDeputyError !== ""}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validation ? validation.FundingOrgOrDeputyError : ""}
                                </Form.Control.Feedback>
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label className="required">Application Needed:</Form.Label>
                        <Form.Control
                            as="select"
                            readOnly={readOnly}
                            value={request.ApplicationNeeded}
                            onChange={e => updateRequest('ApplicationNeeded', e.target.value)}
                        >
                            {Object.values(ApplicationTypes).map(type => <option key={type}>{type}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {request.ApplicationNeeded === ApplicationTypes.OTHER &&
                            <>
                                <Form.Label className="required">If Other, please name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Other Application Needed"
                                    readOnly={readOnly}
                                    value={request.OtherApplicationNeeded}
                                    onChange={e => updateRequest('OtherApplicationNeeded', e.target.value)}
                                    isValid={validation && !validation.OtherApplicationNeededError}
                                    isInvalid={validation && validation.OtherApplicationNeededError !== ""}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validation ? validation.OtherApplicationNeededError : ""}
                                </Form.Control.Feedback>
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col className="request-vertical-center" xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Projected Organizations Impacted:</Form.Label>
                    </Col>
                    <Col className="request-vertical-center" xl="2" lg="3" md="6" sm="6" xs="12">
                        <Form.Check inline label="Enterprise" type="checkbox" id="enterprise-checkbox"
                            disabled={readOnly}
                            checked={request.IsProjectedOrgsEnterprise}
                            onChange={() => updateRequest('IsProjectedOrgsEnterprise', !request.IsProjectedOrgsEnterprise)}
                        />
                    </Col>
                    <Col xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label className="required">Impacted Center:</Form.Label>
                        <Form.Control
                            as="select"
                            readOnly={readOnly}
                            value={request.ProjectedOrgsImpactedCenter}
                            onChange={e => updateRequest('ProjectedOrgsImpactedCenter', e.target.value)}
                        >
                            {Object.values(Centers).map(center => <option key={center}>{center}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="3" md="6" sm="6" xs="12">
                        <Form.Label className="required">Impacted Org:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Projected Org Impacted"
                            readOnly={readOnly}
                            value={request.ProjectedOrgsImpactedOrg}
                            onChange={e => updateRequest('ProjectedOrgsImpactedOrg', e.target.value)}
                            isValid={validation && !validation.ProjectedOrgsImpactedOrgError}
                            isInvalid={validation && validation.ProjectedOrgsImpactedOrgError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.ProjectedOrgsImpactedOrgError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="5" lg="6" md="6" sm="6" xs="12">
                        <Form.Label>Projected Number of Impacted Users:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Number of Users Impacted by the Requested Application"
                            readOnly={readOnly}
                            value={request.ProjectedImpactedUsers ? request.ProjectedImpactedUsers : undefined}
                            onChange={e => updateRequest("ProjectedImpactedUsers", parseInt(getNumbersOnly(e.target.value)))}
                        />
                    </Col>
                    <Col xl="3" lg="4" md="4" sm="4" xs="12">
                        <CustomInputeDatePicker
                            headerText="Operational Need Date:"
                            readOnly={readOnly}
                            date={request.OperationalNeedDate}
                            minDate={oldRequest && oldRequest.OperationalNeedDate && oldRequest.OperationalNeedDate.isBefore(moment()) ? oldRequest.OperationalNeedDate : moment()}
                            onChange={date => updateRequest('OperationalNeedDate', date)}
                            isClearable
                        />
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0 required">Organization's Priority:</Form.Label>
                        <Form.Check inline
                            label={<>{OrgPriorities.HIGH} <span className="subtext">(Essential to Deliver)</span></>}
                            type="radio"
                            id={"high-priority-radio"}
                            disabled={readOnly}
                            checked={request.OrgPriority === OrgPriorities.HIGH}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.HIGH)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.MEDIUM} <span className="subtext">(Functional Capabilities Enhancements)</span></>}
                            type="radio"
                            id={"medium-priority-radio"}
                            disabled={readOnly}
                            checked={request.OrgPriority === OrgPriorities.MEDIUM}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.MEDIUM)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.LOW} <span className="subtext">(Desire to have/worth Implementing)</span></>}
                            type="radio"
                            id={"low-priority-radio"}
                            disabled={readOnly}
                            checked={request.OrgPriority === OrgPriorities.LOW}
                            onChange={() => updateRequest("OrgPriority", OrgPriorities.LOW)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="required">Priority Explanation:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Detailed explanation for the priority given..."
                            readOnly={readOnly}
                            value={request.PriorityExplanation}
                            onChange={e => updateRequest('PriorityExplanation', e.target.value)}
                            isValid={validation && !validation.PriorityExplanationError}
                            isInvalid={validation && validation.PriorityExplanationError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.PriorityExplanationError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="required">
                            Business Objective: <span className="subtext">(What problem is the business trying to solve?)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="Detailed explanation of the objective that the business would like this application to achieve..."
                            readOnly={readOnly}
                            value={request.BusinessObjective}
                            onChange={e => updateRequest('BusinessObjective', e.target.value)}
                            isValid={validation && !validation.BusinessObjectiveError}
                            isInvalid={validation && validation.BusinessObjectiveError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.BusinessObjectiveError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="required">
                            Functional Requirements: <span className="subtext">(System capabilities for users to perform job efficiently)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="The system shall provide the ability to..."
                            readOnly={readOnly}
                            value={request.FunctionalRequirements}
                            onChange={e => updateRequest('FunctionalRequirements', e.target.value)}
                            isValid={validation && !validation.FunctionalRequirementsError}
                            isInvalid={validation && validation.FunctionalRequirementsError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.FunctionalRequirementsError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="required">
                            Benefits: <span className="subtext">(Time savings, reduce costs, productivity efficiency, etc.)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Benefits this capability will bring to the organization(s) and/or users..."
                            readOnly={readOnly}
                            value={request.Benefits}
                            onChange={e => updateRequest('Benefits', e.target.value)}
                            isValid={validation && !validation.BenefitsError}
                            isInvalid={validation && validation.BenefitsError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.BenefitsError : ""}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="required">
                            Risks: <span className="subtext">(What is the risk if requirement is not approved and implemented)?</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Detailed explanation of what the risks are for the organization if the requirement is not met..."
                            readOnly={readOnly}
                            value={request.Risk}
                            onChange={e => updateRequest('Risk', e.target.value)}
                            isValid={validation && !validation.RiskError}
                            isInvalid={validation && validation.RiskError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validation ? validation.RiskError : ""}
                        </Form.Control.Feedback>
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
                            readOnly={readOnly}
                            value={request.AdditionalInfo}
                            onChange={e => updateRequest('AdditionalInfo', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                {!readOnly && <>
                    <Button
                        className="mb-3 ml-2 float-right"
                        variant="primary"
                        onClick={submitRequest}
                        disabled={saving}
                    >
                        {saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Submit Request"}
                    </Button>
                    {canSaveWithoutSubmitting() && <Button
                        className="mb-3 ml-2 float-right"
                        variant="outline-primary"
                        onClick={(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => submitRequest(e, true)}
                        disabled={saving}
                    >
                        {saving && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Save Without Submitting"}
                    </Button>}
                </>}
                <Link to="/Requests">
                    <Button className="mb-3 float-left" variant="secondary">
                        Cancel
                    </Button>
                </Link>
            </Form>
            <RequestSpinner show={saving} displayText="Saving Request..." />
            <DismissableErrorAlert
                show={error !== undefined && error !== ""}
                header="Error Submitting!"
                message={error}
                onClose={() => setError("")}
            />
        </Container>);
}