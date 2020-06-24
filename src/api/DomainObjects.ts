import moment, { Moment } from 'moment';
import { RequirementsRequestsApiConfig, IRequirementsRequestApi } from './RequirementsRequestsApi';

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
    Id: string,
    Title: string,
    RequestDate: Moment,
    ReceivedDate: Moment,
    Requester: {
        Id: string,
        Title: string,
        Email: string
    },
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEO: {
        Id: string,
        Title: string,
        Email: string
    },
    PEOApprovedDate: Moment,
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
    AdditionalInfo: string
}

export interface IRequirementsRequestCRUD extends IRequirementsRequest {
    getUpdated: () => Promise<IRequirementsRequestCRUD | null | undefined>,
    save: () => Promise<IRequirementsRequest> | null | undefined,
    delete: () => void
}

export class RequirementsRequest implements IRequirementsRequestCRUD {

    api: IRequirementsRequestApi

    Id = ""
    Title = ""
    RequestDate = moment()
    ReceivedDate = moment()
    Requester = {
        Id: "",
        Title: "",
        Email: ""
    }
    RequesterOrgSymbol = ""
    RequesterDSNPhone = ""
    RequesterCommPhone = ""
    ApprovingPEO = {
        Id: "",
        Title: "",
        Email: ""
    }
    PEOApprovedDate = moment()
    PEOOrgSymbol = ""
    PEO_DSNPhone = ""
    PEO_CommPhone = ""
    RequirementType = RequirementTypes.NEW_CAP
    FundingOrgOrPEO = ""
    ApplicationNeeded = ApplicationTypes.CCaR
    OtherApplicationNeeded = ""
    IsProjectedOrgsEnterprise = false
    ProjectedOrgsImpactedCenter = Centers.AFIMSC
    ProjectedOrgsImpactedOrg = ""
    ProjectedImpactedUsers = 0
    OperationalNeedDate = moment()
    OrgPriority = OrgPriorities.LOW
    PriorityExplanation = ""
    BusinessObjective = ""
    FunctionalRequirements = ""
    Benefits = ""
    Risk = ""
    AdditionalInfo = ""

    constructor(request?: IRequirementsRequest, api?: IRequirementsRequestApi) {
        if (request) {
            Object.assign(this, request);
        }
        this.api = api ? api : RequirementsRequestsApiConfig.getApi();
    }

    getUpdated = async (): Promise<IRequirementsRequestCRUD | null | undefined> => {
        return this.Id && parseInt(this.Id) > -1 ? await this.api.fetchRequirementsRequestById(this.Id) : this;
    }

    save = (): Promise<IRequirementsRequest> | null | undefined => {
        return this.api.submitRequirementsRequest(this);
    }
    
    delete = (): void => {
        if (this.Id && parseInt(this.Id) > -1) {
            this.api.deleteRequirementsRequest(this);
        }
    }
}