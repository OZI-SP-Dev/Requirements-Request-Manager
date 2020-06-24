import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, OrgPriorities, RequirementTypes } from "./DomainObjects";
import RequirementsRequestsApiDev from "./RequirementsRequestsApiDev";

interface ISubmitRequirementsRequest {
    Id?: string
    Title: string
    RequestDate: string
    ReceivedDate: string
    RequesterId: string
    RequesterOrgSymbol: string
    RequesterDSNPhone: string
    RequesterCommPhone: string
    ApprovingPEOId: string
    PEOApprovedDate: string
    PEOOrgSymbol: string
    PEO_DSNPhone: string
    PEO_CommPhone: string
    RequirementType: RequirementTypes
    FundingOrgOrPEO: string
    ApplicationNeeded: ApplicationTypes
    OtherApplicationNeeded: string
    IsProjectedOrgsEnterprise: boolean
    ProjectedOrgsImpactedCenter: Centers
    ProjectedOrgsImpactedOrg: string
    ProjectedImpactedUsers: number
    OperationalNeedDate: string
    OrgPriority: OrgPriorities
    PriorityExplanation: string
    BusinessObjective: string
    FunctionalRequirements: string
    Benefits: string
    Risk: string
    AdditionalInfo: string
}

const getSubmitRequirementsRequest = (request: IRequirementsRequest): ISubmitRequirementsRequest => {
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
    fetchRequirementsRequestById(Id: string): Promise<IRequirementsRequestCRUD | null | undefined>,
    fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]>,
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD>,
    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): void
}

export default class RequirementsRequestsApi implements IRequirementsRequestApi {
    fetchRequirementsRequestById(Id: string): Promise<IRequirementsRequestCRUD> {
        throw new Error("Method not implemented.");
    }

    fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]> {
        throw new Error("Method not implemented.");
    }

    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        throw new Error("Method not implemented.");
    }

    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): void {
        throw new Error("Method not implemented.");
    }
}

export class RequirementsRequestsApiConfig {
    private static requirementsRequestsApi: IRequirementsRequestApi

    static getApi(): IRequirementsRequestApi {
        if (!this.requirementsRequestsApi) {
            this.requirementsRequestsApi = process.env.NODE_ENV === 'development' ? new RequirementsRequestsApiDev() : new RequirementsRequestsApi();
        }
        return this.requirementsRequestsApi;
    }
}