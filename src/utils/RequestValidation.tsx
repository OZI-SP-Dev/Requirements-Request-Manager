import { Moment } from "moment";
import { IRequirementsRequest, ApplicationTypes } from "../api/DomainObjects";
import moment from "moment";

export interface IRequestValidation {
    IsErrored?: boolean,
    TitleError: string,
    RequestDateError: string,
    RequesterError: string,
    RequesterOrgSymbolError: string,
    RequesterDSNPhoneError: string,
    RequesterCommPhoneError: string,
    ApprovingPEOError: string,
    PEOOrgSymbolError: string,
    PEO_DSNPhoneError: string,
    PEO_CommPhoneError: string,
    FundingOrgOrPEOError: string,
    OtherApplicationNeededError: string,
    ProjectedOrgsImpactedOrgError: string,
    ProjectedImpactedUsersError: string,
    OperationalNeedDateError: string,
    PriorityExplanationError: string,
    BusinessObjectiveError: string,
    FunctionalRequirementsError: string,
    BenefitsError: string,
    RiskError: string,
}

export class RequestValidation {

    private static getSingleLineValidation(field: string, charLimit: number): string {
        if (field) {
            return field.length <= charLimit ? "" : "Too many characters entered, please shorten the length!";
        } else {
            return "Please fill in this field!";
        }
    }

    private static getPhoneNumberValidation(field: string): string {
        if (new RegExp("[^0-9]").exec(field)) {
            return "Only numeric values should be used!";
        } else if (field.length < 10) {
            return "Please enter the full phone number, including area code!";
        } else if (field.length > 10) {
            return "Too many numbers given, please use a 10 digit phone number!";
        } else {
            return "";
        }
    }

    private static getDateValidation(field: Moment, minDate?: Moment, maxDate?: Moment): string {
        if (!field) {
            return "Please enter a date that the requirement is needed by!";
        } else if (minDate && field.isBefore(minDate.startOf('day'))) {
            return `Your date selected must be on or after ${minDate.format("DD MMM YYYY")}!`;
        } else if (maxDate && field.isAfter(maxDate.endOf('day'))) {
            return `Your date selected must be on or before ${maxDate.format("DD MMM YYYY")}!`;
        } else {
            return "";
        }
    }

    static getValidation(request: IRequirementsRequest, isFunded: boolean): IRequestValidation {
        let validation: IRequestValidation = {
            TitleError: this.getSingleLineValidation(request.Title, 255),
            RequestDateError: this.getDateValidation(request.RequestDate, undefined, moment()),
            RequesterError: request.Requester && request.Requester.EMail ? "" : "Please provide a Requester!",
            RequesterOrgSymbolError: this.getSingleLineValidation(request.RequesterOrgSymbol, 15),
            RequesterDSNPhoneError: this.getPhoneNumberValidation(request.RequesterDSNPhone),
            RequesterCommPhoneError: this.getPhoneNumberValidation(request.RequesterCommPhone),
            ApprovingPEOError: request.ApprovingPEO && request.ApprovingPEO.EMail ? "" : "Please provide a 2 Ltr/PEO to approve this request!",
            PEOOrgSymbolError: this.getSingleLineValidation(request.PEOOrgSymbol, 15),
            PEO_DSNPhoneError: this.getPhoneNumberValidation(request.PEO_DSNPhone),
            PEO_CommPhoneError: this.getPhoneNumberValidation(request.PEO_CommPhone),
            FundingOrgOrPEOError: isFunded ? this.getSingleLineValidation(request.FundingOrgOrPEO, 255) : "",
            OtherApplicationNeededError: request.ApplicationNeeded === ApplicationTypes.OTHER ? this.getSingleLineValidation(request.OtherApplicationNeeded, 255) : "",
            ProjectedOrgsImpactedOrgError: this.getSingleLineValidation(request.ProjectedOrgsImpactedOrg, 15),
            ProjectedImpactedUsersError: request.ProjectedImpactedUsers > 0 ? "" : "Please enter the projected number of users to be impacted by the request!",
            OperationalNeedDateError: this.getDateValidation(request.OperationalNeedDate, moment()),
            PriorityExplanationError: request.PriorityExplanation ? "" : "Please enter an explanation for why the priority of the requirements request was given!",
            BusinessObjectiveError: request.BusinessObjective ? "" : "Please enter the business objective for the requirement being requested!",
            FunctionalRequirementsError: request.FunctionalRequirements ? "" : "Please enter the functional requirements for the requirement being requested!",
            BenefitsError: request.Benefits ? "" : "Please enter the benefits to your org that the requirement being requested will provide!",
            RiskError: request.Risk ? "" : "Please provide the risks associated to your org for the requirement being requested!"
        }
        validation.IsErrored = Object.values(validation).findIndex(value => value !== "") > -1;
        return validation;
    }

}