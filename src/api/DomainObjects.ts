import { Moment } from 'moment';
import moment from 'moment';

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
    RequirementType: "New Capability" | "Modification to exiting capability" | "Functional" | "Non - Functional",
    FundingOrgOrPEO: string,
    ApplicationNeeded: "CCaR" | "CPE" | "DAPR" | "MAR" | "PMRT" | "PMRT-EA" | "RIT" | "SharePoint" | "SRM" | "Other",
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: boolean,
    ProjectedOrgsImpactedCenter: "AFIMSC" | "AFLCMC" | "AFNWC" | "AFSC" | "AFTC" | "SMC",
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: number,
    OperationalNeedDate: Moment,
    OrgPriority: "High" | "Medium" | "Low",
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
        RequirementType: "New Capability",
        FundingOrgOrPEO: "",
        ApplicationNeeded: "CCaR",
        OtherApplicationNeeded: "",
        IsProjectedOrgsEnterprise: false,
        ProjectedOrgsImpactedCenter: "AFIMSC",
        ProjectedOrgsImpactedOrg: "",
        ProjectedImpactedUsers: 0,
        OperationalNeedDate: moment(),
        OrgPriority: "Low",
        PriorityExplanation: "",
        BusinessObjective: "",
        FunctionalRequirements: "",
        Benefits: "",
        Risk: "",
        AdditionalInfo: ""
    }
}