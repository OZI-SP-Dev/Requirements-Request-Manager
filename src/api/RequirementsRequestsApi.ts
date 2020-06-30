import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, OrgPriorities, RequirementTypes, RequirementsRequest } from "./DomainObjects";
import RequirementsRequestsApiDev from "./RequirementsRequestsApiDev";
import { spWebContext } from "../providers/SPWebContext";
import moment from "moment";
import { UserApiConfig } from "./UserApi";

interface ISubmitRequirementsRequest {
    Id?: number
    Title: string
    RequestDate: string
    ReceivedDate: string
    RequesterId: string | number
    RequesterOrgSymbol: string
    RequesterDSNPhone: string
    RequesterCommPhone: string
    ApprovingPEOId: string | number
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

interface SPRequirementsRequest {
    Id: number,
    Title: string,
    RequestDate: string,
    ReceivedDate: string,
    Requester: {
        Id: string,
        Title: string,
        EMail: string
    },
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEO: {
        Id: string,
        Title: string,
        EMail: string
    },
    PEOApprovedDate: string,
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
    OperationalNeedDate: string,
    OrgPriority: OrgPriorities,
    PriorityExplanation: string,
    BusinessObjective: string,
    FunctionalRequirements: string,
    Benefits: string,
    Risk: string,
    AdditionalInfo: string,
    "odata.etag": string
}

export interface IRequirementsRequestApi {
    fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | null | undefined>,
    fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]>,
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD>,
    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void>
}

export default class RequirementsRequestsApi implements IRequirementsRequestApi {

    requirementsRequestList = spWebContext.lists.getByTitle("RequirementsRequests");
    userApi = UserApiConfig.getApi();

    getSubmitRequirementsRequest = async (request: IRequirementsRequest): Promise<ISubmitRequirementsRequest> => {
        return {
            Id: request.Id,
            Title: request.Title,
            RequestDate: request.RequestDate.toISOString(),
            ReceivedDate: request.ReceivedDate.toISOString(),
            RequesterId: request.Requester.Id ? request.Requester.Id : (await this.userApi.getCurrentUser()).Id,
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            ApprovingPEOId: request.ApprovingPEO.Id ? request.ApprovingPEO.Id : (await spWebContext.ensureUser(request.ApprovingPEO.Email)).data.Id,
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

    getIRequirementsRequest = (request: SPRequirementsRequest): IRequirementsRequest => {
        return {
            Id: request.Id,
            Title: request.Title,
            RequestDate: moment(request.RequestDate),
            ReceivedDate: moment(request.ReceivedDate),
            Requester: {
                Id: request.Requester.Id,
                Title: request.Requester.Title,
                Email: request.Requester.EMail
            },
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            ApprovingPEO: {
                Id: request.ApprovingPEO.Id,
                Title: request.ApprovingPEO.Title,
                Email: request.ApprovingPEO.EMail
            },
            PEOApprovedDate: moment(request.PEOApprovedDate),
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
            OperationalNeedDate: moment(request.OperationalNeedDate),
            OrgPriority: request.OrgPriority,
            PriorityExplanation: request.PriorityExplanation,
            BusinessObjective: request.BusinessObjective,
            FunctionalRequirements: request.FunctionalRequirements,
            Benefits: request.Benefits,
            Risk: request.Risk,
            AdditionalInfo: request.AdditionalInfo,
            "odata.etag": request["odata.etag"]
        }
    }

    fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD> {
        return this.requirementsRequestList.items.getById(Id).get();
    }

    async fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]> {
        let pagedRequests = await this.requirementsRequestList.items.select("Id", "Title", "RequestDate", "ReceivedDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "ApprovingPEO/Id", "ApprovingPEO/Title", "ApprovingPEO/EMail", "PEOApprovedDate", "PEOOrgSymbol", "PEO_DSNPhone", "PEO_CommPhone", "RequirementType", "FundingOrgOrPEO", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Requester", "ApprovingPEO").getPaged();
        let requests: SPRequirementsRequest[] = pagedRequests.results;
        while (pagedRequests.hasNext) {
            requests = requests.concat((await pagedRequests.getNext()).results);
        }
        let requirementRequestCRUDs: IRequirementsRequestCRUD[] = [];
        for (let request of requests) {
            requirementRequestCRUDs.push(new RequirementsRequest(this.getIRequirementsRequest(request), this));
        }
        return requirementRequestCRUDs;
    }

    async submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        console.log("requirementsRequest");
        console.log(requirementsRequest);
        let submitRequest = await this.getSubmitRequirementsRequest(requirementsRequest);
        console.log("submitRequest");
        console.log(submitRequest);
        let returnedRequest = requirementsRequest;
        if (requirementsRequest.Id > -1) {
            returnedRequest["odata.etag"] = (await this.requirementsRequestList.items.getById(requirementsRequest.Id).update(submitRequest)).data["odata.etag"];
        } else {
            returnedRequest = this.getIRequirementsRequest((await this.requirementsRequestList.items.add(submitRequest)).data);
        }
        console.log("returnedRequest");
        console.log(returnedRequest);
        return new RequirementsRequest(returnedRequest, this);
    }

    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void> {
        return this.requirementsRequestList.items.getById(requirementsRequest.Id).delete();
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