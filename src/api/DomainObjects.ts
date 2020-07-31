import moment, { Moment } from 'moment';
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from './RequirementsRequestsApi';
import { IPerson, Person } from './UserApi';

export enum RequirementTypes {
    NEW_CAP = "New Capability",
    MOD_EXISTING_CAP = "Modification to existing capability",
    FUNCTIONAL = "Functional",
    NON_FUNCTIONAL = "Non - Functional"
}

export enum ApplicationTypes {
    CCaR = "CCaR",
    CPE = "CPE",
    DAPR = "DAPR",
    MAR = "MAR",
    PMRT = "PMRT",
    PMRT_EA = "PMRT-EA",
    RIT = "RIT",
    SHAREPOINT = "SharePoint",
    SRM = "SRM",
    OTHER = "Other"
}

export enum Centers {
    AFIMSC = "AFIMSC",
    AFLCMC = "AFLCMC",
    AFNWC = "AFNWC",
    AFSC = "AFSC",
    AFTC = "AFTC",
    SMC = "SMC"
}

export enum OrgPriorities {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low"
}

export interface IRequirementsRequest {
    Id: number,
    Title: string,
    RequestDate: Moment,
    ReceivedDate: Moment,
    Requester: IPerson,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEO: IPerson,
    PEOApprovedDateTime: Moment | null,
    PEOApprovedComment: string | null,
    PEOOrgSymbol: string,
    PEO_DSNPhone: string,
    PEO_CommPhone: string,
    RequirementType: RequirementTypes,
    FundingOrgOrPEO: string,
    ApplicationNeeded: ApplicationTypes,
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: boolean,
    ProjectedOrgsImpactedCenter: Centers,
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: number,
    OperationalNeedDate: Moment,
    OrgPriority: OrgPriorities,
    PriorityExplanation: string,
    BusinessObjective: string,
    FunctionalRequirements: string,
    Benefits: string,
    Risk: string,
    AdditionalInfo: string,
    "odata.etag": string
}

export interface IRequirementsRequestCRUD extends IRequirementsRequest {
    /** 
     * Get an updated version of the current RequirementsRequest, it will overwrite the current fields of this request.
     * 
     * @returns the most up to date version of this RequirementsRequest can return undefined if it has not been saved yet.
     */
    getUpdated: () => Promise<IRequirementsRequestCRUD | undefined>,

    /**
     * Save/persist the current RequirementsRequest. This method
     * should be used for both the initial submit and any updaets.
     * 
     * @returns the saved/persisted RequirementsRequest, it will now have an Id if it was a new request.
     */
    save: () => Promise<IRequirementsRequestCRUD | undefined>,

    /**
     * Remove this RequirementsRequest from its persistence
     */
    delete: () => Promise<void>

    /**
     * Returns whether or not this RequirementsRequest is read-only or not. It will
     * determine this based on roles and whether it has been approved or not.
     * 
     * @returns true if this RequirementsRequest is read-only or not
     */
    isReadOnly: () => boolean
}

const blankRequest: IRequirementsRequest = {
    Id: -1,
    Title: "",
    RequestDate: moment(),
    ReceivedDate: moment(),
    Requester: new Person(),
    RequesterOrgSymbol: "",
    RequesterDSNPhone: "",
    RequesterCommPhone: "",
    ApprovingPEO: new Person(),
    PEOApprovedDateTime: null,
    PEOApprovedComment: null,
    PEOOrgSymbol: "",
    PEO_DSNPhone: "",
    PEO_CommPhone: "",
    RequirementType: RequirementTypes.NEW_CAP,
    FundingOrgOrPEO: "",
    ApplicationNeeded: ApplicationTypes.CCaR,
    OtherApplicationNeeded: "",
    IsProjectedOrgsEnterprise: false,
    ProjectedOrgsImpactedCenter: Centers.AFIMSC,
    ProjectedOrgsImpactedOrg: "",
    ProjectedImpactedUsers: 0,
    OperationalNeedDate: moment(),
    OrgPriority: OrgPriorities.LOW,
    PriorityExplanation: "",
    BusinessObjective: "",
    FunctionalRequirements: "",
    Benefits: "",
    Risk: "",
    AdditionalInfo: "",
    "odata.etag": ""
}

/**
 * Full implementation for IRequirementsRequestCRUD. If none is supplied it will just use the default API for persistence,
 * given by RequirementsRequestsApiConfig. This should be the default behavior but it allows the user to supply an API for 
 * test purposes and because when running locally there can be a cyclical initialization when setting up test data.
 */
export class RequirementsRequest implements IRequirementsRequestCRUD {

    api: IRequirementsRequestApi;

    Id: number;
    Title: string;
    RequestDate: Moment;
    ReceivedDate: Moment;
    Requester: IPerson;
    RequesterOrgSymbol: string;
    RequesterDSNPhone: string;
    RequesterCommPhone: string;
    ApprovingPEO: IPerson;
    PEOApprovedDateTime: Moment | null;
    PEOApprovedComment: string | null;
    PEOOrgSymbol: string;
    PEO_DSNPhone: string;
    PEO_CommPhone: string;
    RequirementType: RequirementTypes;
    FundingOrgOrPEO: string;
    ApplicationNeeded: ApplicationTypes;
    OtherApplicationNeeded: string;
    IsProjectedOrgsEnterprise: boolean;
    ProjectedOrgsImpactedCenter: Centers;
    ProjectedOrgsImpactedOrg: string;
    ProjectedImpactedUsers: number;
    OperationalNeedDate: Moment;
    OrgPriority: OrgPriorities;
    PriorityExplanation: string;
    BusinessObjective: string;
    FunctionalRequirements: string;
    Benefits: string;
    Risk: string;
    AdditionalInfo: string;
    "odata.etag": string;

    constructor(request: IRequirementsRequest = blankRequest, api?: IRequirementsRequestApi) {
        this.api = api ? api : RequirementsRequestsApiConfig.getApi();

        this.Id = request.Id;
        this.Title = request.Title;
        this.RequestDate = request.RequestDate;
        this.ReceivedDate = request.ReceivedDate;
        this.Requester = request.Requester;
        this.RequesterOrgSymbol = request.RequesterOrgSymbol;
        this.RequesterDSNPhone = request.RequesterDSNPhone;
        this.RequesterCommPhone = request.RequesterCommPhone;
        this.ApprovingPEO = request.ApprovingPEO;
        this.PEOApprovedDateTime = request.PEOApprovedDateTime;
        this.PEOApprovedComment = request.PEOApprovedComment;
        this.PEOOrgSymbol = request.PEOOrgSymbol;
        this.PEO_DSNPhone = request.PEO_DSNPhone;
        this.PEO_CommPhone = request.PEO_CommPhone;
        this.RequirementType = request.RequirementType;
        this.FundingOrgOrPEO = request.FundingOrgOrPEO;
        this.ApplicationNeeded = request.ApplicationNeeded;
        this.OtherApplicationNeeded = request.OtherApplicationNeeded;
        this.IsProjectedOrgsEnterprise = request.IsProjectedOrgsEnterprise;
        this.ProjectedOrgsImpactedCenter = request.ProjectedOrgsImpactedCenter;
        this.ProjectedOrgsImpactedOrg = request.ProjectedOrgsImpactedOrg;
        this.ProjectedImpactedUsers = request.ProjectedImpactedUsers;
        this.OperationalNeedDate = request.OperationalNeedDate;
        this.OrgPriority = request.OrgPriority;
        this.PriorityExplanation = request.PriorityExplanation;
        this.BusinessObjective = request.BusinessObjective;
        this.FunctionalRequirements = request.FunctionalRequirements;
        this.Benefits = request.Benefits;
        this.Risk = request.Risk;
        this.AdditionalInfo = request.AdditionalInfo;
        this["odata.etag"] = request["odata.etag"];
    }

    getUpdated = async (): Promise<IRequirementsRequestCRUD | undefined> => {
        return this.Id && this.Id > -1 ? await this.api.fetchRequirementsRequestById(this.Id) : this;
    }

    save = async (): Promise<IRequirementsRequestCRUD | undefined> => {
        return this.api.submitRequirementsRequest(this);
    }

    delete = async (): Promise<void> => {
        if (this.Id && this.Id > -1) {
            return this.api.deleteRequirementsRequest(this);
        }
    }

    isReadOnly = (): boolean => {
        return this.PEOApprovedDateTime !== null;
    }
}

export interface IRequestValidation {
    IsErrored?: boolean,
    TitleError: string,
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

    private static getSingleLineValidation(field: string): string {
        if (field) {
            return field.length < 255 ? "" : "Too many characters entered, please shorten the length!";
        } else {
            return "Please fill in this field!";
        }
    }

    private static getPhoneNumberValidation(field: string): string {
        if (new RegExp("[^0-9]").exec(field)) {
            return "Only numeric values should be used!";
        } else if (field.length < 10) {
            return "Please enter the full phone number, includig area code!";
        } else if (field.length > 10) {
            return "Too many numbers given, please use a 10 digit phone number!";
        } else {
            return "";
        }
    }

    static getValidation(request: IRequirementsRequest, isFunded: boolean): IRequestValidation {
        let validation: IRequestValidation = {
            TitleError: this.getSingleLineValidation(request.Title),
            RequesterError: request.Requester ? "" : "Please provide a Requester!",
            RequesterOrgSymbolError: this.getSingleLineValidation(request.RequesterOrgSymbol),
            RequesterDSNPhoneError: this.getPhoneNumberValidation(request.RequesterDSNPhone),
            RequesterCommPhoneError: this.getPhoneNumberValidation(request.RequesterCommPhone),
            ApprovingPEOError: request.ApprovingPEO ? "" : "Please provide a 2 Ltr/PEO to approve this request!",
            PEOOrgSymbolError: this.getSingleLineValidation(request.PEOOrgSymbol),
            PEO_DSNPhoneError: this.getPhoneNumberValidation(request.PEO_DSNPhone),
            PEO_CommPhoneError: this.getPhoneNumberValidation(request.PEO_CommPhone),
            FundingOrgOrPEOError: isFunded ? this.getSingleLineValidation(request.FundingOrgOrPEO) : "",
            OtherApplicationNeededError: request.ApplicationNeeded === ApplicationTypes.OTHER ? this.getSingleLineValidation(request.OtherApplicationNeeded) : "",
            ProjectedOrgsImpactedOrgError: this.getSingleLineValidation(request.ProjectedOrgsImpactedOrg),
            ProjectedImpactedUsersError: request.ProjectedImpactedUsers > 0 ? "" : "Please enter the projected number of users to be impacted by the request!",
            OperationalNeedDateError: request.OperationalNeedDate ? "" : "Please enter a date that the requirement is needed by!",
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