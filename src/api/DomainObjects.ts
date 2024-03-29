import moment, { Moment } from 'moment';
import { RoleDefinitions } from '../utils/RoleDefinitions';
import { IRequirementsRequestApi, RequirementsRequestsApiConfig } from './RequirementsRequestsApi';
import { RoleType } from './RolesApi';
import { IPerson, Person } from './UserApi';

export enum NoveltyRequirementTypes {
    NEW_CAP = "New Capability",
    MOD_EXISTING_CAP = "Modification to existing capability"
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

export enum RequestStatuses {
    SAVED = "Saved",
    SUBMITTED = "Submitted",
    APPROVED = "Approved",
    DISAPPROVED = "Disapproved",
    ACCEPTED = "Manager Accepted",
    DECLINED = "Manager Declined",
    CITO_APPROVED = "CITO Approved",
    CITO_DISAPPROVED = "CITO Disapproved",
    REVIEW = "Review for Contract",
    CONTRACT = "On Contract",
    CLOSED = "Closed",
    CANCELLED = "Cancelled"
}

export const getNextStatus = (status: RequestStatuses): RequestStatuses | null => {
    switch (status) {
        case RequestStatuses.SAVED:
            return RequestStatuses.SUBMITTED;
        case RequestStatuses.SUBMITTED:
            return RequestStatuses.APPROVED;
        case RequestStatuses.APPROVED:
            return RequestStatuses.ACCEPTED;
        case RequestStatuses.DISAPPROVED:
            return RequestStatuses.SUBMITTED;
        case RequestStatuses.ACCEPTED:
            return RequestStatuses.CITO_APPROVED;
        case RequestStatuses.DECLINED:
            return RequestStatuses.SUBMITTED;
        case RequestStatuses.CITO_APPROVED:
            return RequestStatuses.REVIEW;
        case RequestStatuses.CITO_DISAPPROVED:
            return RequestStatuses.SUBMITTED;
        case RequestStatuses.REVIEW:
            return RequestStatuses.CONTRACT;
        case RequestStatuses.CONTRACT:
            return RequestStatuses.CLOSED;
        default:
            return null;
    }
}

export const getRejectStatus = (request: IRequirementsRequest): RequestStatuses | null => {
    switch (request.Status) {
        case RequestStatuses.SUBMITTED:
            return RequestStatuses.DISAPPROVED;
        case RequestStatuses.APPROVED:
            return RequestStatuses.DECLINED;
        case RequestStatuses.ACCEPTED:
            return RequestStatuses.CITO_DISAPPROVED;
        default:
            return null;
    }
}

export const getStatusText = (status: RequestStatuses | null): string => {
    switch (status) {
        case RequestStatuses.SUBMITTED:
            return "Requester Submit";
        case RequestStatuses.APPROVED:
            return "2 Ltr Review";
        case RequestStatuses.DISAPPROVED:
            return "2 Ltr Rejected";
        case RequestStatuses.ACCEPTED:
            return "Req Mgr Review";
        case RequestStatuses.DECLINED:
            return "Req Mgr Rejected";
        case RequestStatuses.CITO_APPROVED:
            return "CITO Review";
        case RequestStatuses.CITO_DISAPPROVED:
            return "CITO Rejected";
        case RequestStatuses.REVIEW:
            return "Board Review(s)";
        case RequestStatuses.CONTRACT:
            return "Contracting"
        case RequestStatuses.CLOSED:
            return "Development"
        default:
            return "None";
    }
}

export interface IRequirementsRequest {
    Id: number,
    Title: string,
    Status: RequestStatuses,
    StatusDateTime: Moment,
    RequestDate: Moment,
    Author: IPerson,
    Requester: IPerson,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string | null,
    RequesterCommPhone: string,
    Approver: IPerson,
    ApproverOrgSymbol: string,
    ApproverDSNPhone: string | null,
    ApproverCommPhone: string,
    NoveltyRequirementType: NoveltyRequirementTypes
    FundingOrgOrDeputy: string,
    ApplicationNeeded: ApplicationTypes,
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: boolean,
    ProjectedOrgsImpactedCenter: Centers,
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: number | null,
    OperationalNeedDate: Moment | null,
    OrgPriority: OrgPriorities,
    PriorityExplanation: string,
    BusinessObjective: string,
    FunctionalRequirements: string,
    Benefits: string,
    Risk: string,
    AdditionalInfo: string,
    "odata.etag": string
}

export type IRequirementsRequestCsvData = {
    Id: string,
    Title: string,
    Status: string,
    StatusDateTimeFormatted: string,
    RequestDateFormatted: string,
    AuthorTitle: string,
    AuthorEmail: string,
    RequesterTitle: string,
    RequesterEmail: string,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string | null,
    RequesterCommPhone: string,
    ApproverTitle: string,
    ApproverEmail: string,
    ApproverOrgSymbol: string,
    ApproverDSNPhone: string | null,
    ApproverCommPhone: string,
    NoveltyRequirementType: string,
    FundingOrgOrDeputy: string,
    ApplicationNeeded: string,
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: string,
    ProjectedOrgsImpactedCenter: string,
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: string | null,
    OperationalNeedDateFormatted: string | null,
    OrgPriority: string,
    PriorityExplanation: string,
    BusinessObjective: string,
    FunctionalRequirements: string,
    Benefits: string,
    Risk: string,
    AdditionalInfo: string
}

export const IRequirementsRequestHeaders = [
    { displayName: "ID", id: "Id" },
    { displayName: "Title", id: "Title" },
    { displayName: "Request Date", id: "RequestDateFormatted" },
    { displayName: "Application Needed", id: "ApplicationNeeded" },
    { displayName: "Is Enterprise", id: "IsProjectedOrgsEnterprise" },
    { displayName: "Impacted Center", id: "ProjectedOrgsImpactedCenter" },
    { displayName: "Impacted Org", id: "ProjectedOrgsImpactedOrg" },
    { displayName: "Projected Number of Impacted Users", id: "ProjectedImpactedUsers" },
    { displayName: "Operational Need Date", id: "OperationalNeedDateFormatted" },
    { displayName: "Priority", id: "OrgPriority" },
    { displayName: "Priority Explanation", id: "PriorityExplanation" },
    { displayName: "Business Objective", id: "BusinessObjective" },
    { displayName: "Functional Requirements", id: "FunctionalRequirements" },
    { displayName: "Benefits", id: "Benefits" },
    { displayName: "Risk", id: "Risk" },
    { displayName: "Additional Info", id: "AdditionalInfo" },
    { displayName: "Requester Org Symbol", id: "RequesterOrgSymbol" },
    { displayName: "Requester Title", id: "RequesterTitle" },
    { displayName: "Requester Email", id: "RequesterEmail" },
    { displayName: "Requester DSN Phone", id: "RequesterDSNPhone" },
    { displayName: "Requester Comm Phone", id: "RequesterCommPhone" },
    { displayName: "Creator Title", id: "AuthorTitle" },
    { displayName: "Creator Email", id: "AuthorEmail" },
    { displayName: "Requirement Type", id: "NoveltyRequirementType" },
    { displayName: "Approver Org Symbol", id: "ApproverOrgSymbol" },
    { displayName: "Approver Title", id: "ApproverTitle" },
    { displayName: "Approver Email", id: "ApproverEmail" },
    { displayName: "Approver DSN Phone", id: "ApproverDSNPhone" },
    { displayName: "Approver Comm Phone", id: "ApproverCommPhone" },
    { displayName: "Request Status", id: "Status" },
    { displayName: "Last Status Update", id: "StatusDateTimeFormatted" }
]

const cleanCsvString = (input: string | null): string => {
    return input ? input.replace(/[\n]+/gm, "\r\n").replace(/["]/gm, `""`) : "";
}

export const getIRequirementsRequestCsvData = (request: IRequirementsRequest): IRequirementsRequestCsvData => {
    const format = "MM/DD/YYYY";
    return {
        Id: request.Id.toString(),
        Title: cleanCsvString(request.Title),
        Status: request.Status,
        StatusDateTimeFormatted: request.StatusDateTime.format(format),
        RequestDateFormatted: request.RequestDate.format(format),
        AuthorTitle: request.Author.Title,
        AuthorEmail: request.Author.EMail,
        RequesterTitle: request.Requester.Title,
        RequesterEmail: request.Requester.EMail,
        RequesterOrgSymbol: cleanCsvString(request.RequesterOrgSymbol),
        RequesterDSNPhone: cleanCsvString(request.RequesterDSNPhone),
        RequesterCommPhone: cleanCsvString(request.RequesterCommPhone),
        ApproverTitle: request.Approver.Title,
        ApproverEmail: request.Approver.EMail,
        ApproverOrgSymbol: cleanCsvString(request.ApproverOrgSymbol),
        ApproverDSNPhone: cleanCsvString(request.ApproverDSNPhone),
        ApproverCommPhone: cleanCsvString(request.ApproverCommPhone),
        NoveltyRequirementType: request.NoveltyRequirementType,
        FundingOrgOrDeputy: cleanCsvString(request.FundingOrgOrDeputy),
        ApplicationNeeded: request.ApplicationNeeded,
        OtherApplicationNeeded: cleanCsvString(request.OtherApplicationNeeded),
        IsProjectedOrgsEnterprise: request.IsProjectedOrgsEnterprise ? "True" : "False",
        ProjectedOrgsImpactedCenter: request.ProjectedOrgsImpactedCenter,
        ProjectedOrgsImpactedOrg: cleanCsvString(request.ProjectedOrgsImpactedOrg),
        ProjectedImpactedUsers: request.ProjectedImpactedUsers ? request.ProjectedImpactedUsers.toString() : null,
        OperationalNeedDateFormatted: request.OperationalNeedDate ? request.OperationalNeedDate.format(format) : null,
        OrgPriority: request.OrgPriority,
        PriorityExplanation: cleanCsvString(request.PriorityExplanation),
        BusinessObjective: cleanCsvString(request.BusinessObjective),
        FunctionalRequirements: cleanCsvString(request.FunctionalRequirements),
        Benefits: cleanCsvString(request.Benefits),
        Risk: cleanCsvString(request.Risk),
        AdditionalInfo: cleanCsvString(request.AdditionalInfo),
    }
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
    save: () => Promise<IRequirementsRequestCRUD | undefined>

    /**
     * Returns whether or not this RequirementsRequest is read-only or not. It will
     * determine this based on roles and whether it has been approved or not.
     * 
     * @returns true if this RequirementsRequest is read-only or not
     */
    isReadOnly: (user?: IPerson, roles?: RoleType[]) => boolean

    /**
     * Returns a more human readable format for the ID rather than just a number.
     */
    getFormattedId: () => string
}

const blankRequest: IRequirementsRequest = {
    Id: -1,
    Title: "",
    Status: RequestStatuses.SUBMITTED,
    StatusDateTime: moment(),
    RequestDate: moment(),
    Author: new Person(),
    Requester: new Person(),
    RequesterOrgSymbol: "",
    RequesterDSNPhone: "",
    RequesterCommPhone: "",
    Approver: new Person(),
    ApproverOrgSymbol: "",
    ApproverDSNPhone: "",
    ApproverCommPhone: "",
    NoveltyRequirementType: NoveltyRequirementTypes.NEW_CAP,
    FundingOrgOrDeputy: "",
    ApplicationNeeded: ApplicationTypes.CCaR,
    OtherApplicationNeeded: "",
    IsProjectedOrgsEnterprise: false,
    ProjectedOrgsImpactedCenter: Centers.AFIMSC,
    ProjectedOrgsImpactedOrg: "",
    ProjectedImpactedUsers: null,
    OperationalNeedDate: null,
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

    private requestApi: IRequirementsRequestApi;

    Id: number;
    Title: string;
    Status: RequestStatuses;
    StatusDateTime: Moment;
    RequestDate: Moment;
    Author: IPerson;
    Requester: IPerson;
    RequesterOrgSymbol: string;
    RequesterDSNPhone: string | null;
    RequesterCommPhone: string;
    Approver: IPerson;
    ApproverOrgSymbol: string;
    ApproverDSNPhone: string | null;
    ApproverCommPhone: string;
    NoveltyRequirementType: NoveltyRequirementTypes;
    FundingOrgOrDeputy: string;
    ApplicationNeeded: ApplicationTypes;
    OtherApplicationNeeded: string;
    IsProjectedOrgsEnterprise: boolean;
    ProjectedOrgsImpactedCenter: Centers;
    ProjectedOrgsImpactedOrg: string;
    ProjectedImpactedUsers: number | null;
    OperationalNeedDate: Moment | null;
    OrgPriority: OrgPriorities;
    PriorityExplanation: string;
    BusinessObjective: string;
    FunctionalRequirements: string;
    Benefits: string;
    Risk: string;
    AdditionalInfo: string;
    "odata.etag": string;

    constructor(request: IRequirementsRequest = blankRequest, requestApi?: IRequirementsRequestApi) {
        this.requestApi = requestApi ? requestApi : RequirementsRequestsApiConfig.getApi();

        this.Id = request.Id;
        this.Title = request.Title;
        this.Status = request.Status;
        this.StatusDateTime = request.StatusDateTime;
        this.RequestDate = request.RequestDate;
        this.Author = request.Author;
        this.Requester = request.Requester;
        this.RequesterOrgSymbol = request.RequesterOrgSymbol;
        this.RequesterDSNPhone = request.RequesterDSNPhone;
        this.RequesterCommPhone = request.RequesterCommPhone;
        this.Approver = request.Approver;
        this.ApproverOrgSymbol = request.ApproverOrgSymbol;
        this.ApproverDSNPhone = request.ApproverDSNPhone;
        this.ApproverCommPhone = request.ApproverCommPhone;
        this.NoveltyRequirementType = request.NoveltyRequirementType;
        this.FundingOrgOrDeputy = request.FundingOrgOrDeputy;
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
        return this.Id && this.Id > -1 ? await this.requestApi.fetchRequirementsRequestById(this.Id) : this;
    }

    save = async (): Promise<IRequirementsRequestCRUD | undefined> => {
        return this.requestApi.submitRequirementsRequest(this);
    }

    isReadOnly = (user?: IPerson, roles?: RoleType[]): boolean => {
        let requestIsApproved = this.Status === RequestStatuses.APPROVED
            || this.Status === RequestStatuses.ACCEPTED
            || this.Status === RequestStatuses.CITO_APPROVED
            || this.Status === RequestStatuses.REVIEW
            || this.Status === RequestStatuses.CONTRACT;
        let requestIsClosed = this.Status === RequestStatuses.CLOSED || this.Status === RequestStatuses.CANCELLED;
        let requestIsNew = this.Id < 0;
        let userIsAuthor = user?.Id === this.Author.Id;
        let userIsRequester = user?.Id === this.Requester.Id;
        let userIsApprover = user?.Id === this.Approver.Id;
        let userHasPermissions = RoleDefinitions.userCanEditOtherUsersRequests(roles);
        return requestIsApproved || requestIsClosed || (!requestIsNew && !userIsAuthor && !userIsRequester && !userIsApprover && !userHasPermissions);
    }

    getFormattedId = (): string => {
        if (this.Id < 0) {
            return "None";
        } else if (this.Id < 10) {
            return `OZI00${this.Id}`;
        } else if (this.Id < 100) {
            return `OZI0${this.Id}`;
        } else {
            return `OZI${this.Id}`;
        }
    }
}

export interface INote {
    Id: number,
    Title: string,
    Text: string,
    Modified: Moment,
    RequestId: number,
    Author: IPerson,
    Status?: RequestStatuses | null,
    "odata.etag": string
}

export type INoteCsvData = {
    Id: string,
    Title: string,
    Text: string,
    ModifiedFormatted: string,
    RequestId: string,
    AuthorTitle: string,
    AuthorEmail: string,
    Status?: string | null,
}

export const INoteHeaders = [
    { displayName: "ID", id: "Id" },
    { displayName: "Title", id: "Title" },
    { displayName: "Note Text", id: "Text" },
    { displayName: "Last Modified", id: "ModifiedFormatted" },
    { displayName: "Request ID", id: "RequestId" },
    { displayName: "Creator", id: "AuthorTitle" },
    { displayName: "Creator Email", id: "AuthorEmail" },
    { displayName: "Status of Request on Note Create", id: "Status" }
]

export const getINoteCsvData = (note: INote): INoteCsvData => {
    const format = "MM/DD/YYYY";
    return {
        Id: note.Id.toString(),
        Title: cleanCsvString(note.Title),
        Text: cleanCsvString(note.Text),
        ModifiedFormatted: note.Modified.format(format),
        RequestId: note.RequestId.toString(),
        AuthorTitle: note.Author.Title,
        AuthorEmail: note.Author.EMail,
        Status: note.Status
    }
}

export interface ISubmitNote {
    Title: string,
    Text: string,
    RequestId: number,
    Status?: RequestStatuses | null,
}