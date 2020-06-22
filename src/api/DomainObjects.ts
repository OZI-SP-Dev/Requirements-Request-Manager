import { Moment } from 'moment';
import moment from 'moment';

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

export const getEmptyRequirementsRequest = (): IRequirementsRequest => {
    return {
        Id: "",
        Title: "",
        RequestDate: moment(),
        ReceivedDate: moment(),
        Requester: {
            Id: "",
            Title: "",
            Email: ""
        },
        RequesterOrgSymbol: "",
        RequesterDSNPhone: "",
        RequesterCommPhone: "",
        ApprovingPEO: {
            Id: "",
            Title: "",
            Email: ""
        },
        PEOApprovedDate: moment(),
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
        AdditionalInfo: ""
    }
}