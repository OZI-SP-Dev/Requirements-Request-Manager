import RequirementsRequestsApiDev from "./RequirementsRequestsApiDev";
import { IRequirementsRequest } from "./DomainObjects";

interface ISubmitRequirementsRequest {
    Id?: string,
    Title: string,
    RequestDate: string,
    ReceivedDate: string,
    RequesterId: string,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEOId: string,
    PEOApprovedDate: string,
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
    OperationalNeedDate: string,
    OrgPriority: "High" | "Medium" | "Low",
    PriorityExplanation: string,
    BusinessObjective: string,
    FunctionalRequirements: string,
    Benefits: string,
    Risk: string,
    AdditionalInfo: string
}

const mapDomainRequestToDTORequest = (request: IRequirementsRequest): ISubmitRequirementsRequest => {
    return {
        Id: request.Id,
        Title: request.Title,
        RequestDate: request.RequestDate.toISOString(),
        ReceivedDate: request.ReceivedDate.toISOString(),
        RequesterId: request.Requester.Id,
        RequesterOrgSymbol: request.RequesterOrgSymbol,
        RequesterDSNPhone: request.RequesterDSNPhone,
        RequesterCommPhone: request.RequesterCommPhone,
        ApprovingPEOId: request.ApprovingPEO.Id,
        PEOApprovedDate: request.PEOApprovedDate.toISOString(),
        PEOOrgSymbol: request.PEOOrgSymbol,
        PEO_DSNPhone: request.PEO_DSNPhone,
        PEO_CommPhone: request.PEO_CommPhone,
        RequirementType: request.RequirementType,
        FundingOrgOrPEO: request.FundingOrgOrPEO,
        ApplicationNeeded: request.ApplicationNeeded,
        OtherApplicationNeeded: request.OtherApplicationNeeded,
        IsProjectedOrgsEnterprise: request.IsProjectedOrgsEnterprise,
        ProjectedOrgsImpactedCenter: request.ProjectedOrgsImpactedCenter,
        ProjectedOrgsImpactedOrg: request.ProjectedOrgsImpactedOrg,
        ProjectedImpactedUsers: request.ProjectedImpactedUsers,
        OperationalNeedDate: request.OperationalNeedDate.toISOString(),
        OrgPriority: request.OrgPriority,
        PriorityExplanation: request.PriorityExplanation,
        BusinessObjective: request.BusinessObjective,
        FunctionalRequirements: request.FunctionalRequirements,
        Benefits: request.Benefits,
        Risk: request.Risk,
        AdditionalInfo: request.AdditionalInfo
    }
}

export interface IRequirementsRequestApi {
    fetchRequirementsRequests(): Promise<IRequirementsRequest[]>
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequest>;
}

export default class RequirementsRequestsApi implements IRequirementsRequestApi {
    fetchRequirementsRequests(): Promise<IRequirementsRequest[]> {
        throw new Error("Method not implemented.");
    }
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequest> {
        throw new Error("Method not implemented.");
    }

}

export class RequirementsRequestsApiConfig {
    static requirementsRequestsApi: IRequirementsRequestApi = process.env.NODE_ENV === 'development' ? new RequirementsRequestsApiDev() : new RequirementsRequestsApi();
}