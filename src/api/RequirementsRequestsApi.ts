import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, OrgPriorities, RequirementTypes, RequirementsRequest } from "./DomainObjects";
import RequirementsRequestsApiDev from "./RequirementsRequestsApiDev";
import { spWebContext } from "../providers/SPWebContext";
import moment from "moment";
import { UserApiConfig, Person, IPerson } from "./UserApi";
import { RequestApprovalsApiConfig, IRequestApproval } from "./RequestApprovalsApi";
import { ApiError, NotAuthorizedError, InternalError } from "./InternalErrors";

/**
 * This interface is used to submit/update requests to SP and it also models what SP returns from those endpoints.
 * It is meant to only be an internal interface and should not be used outside of communicating with the SP API.
 */
interface ISubmitRequirementsRequest {
    // can be undefined if it is an intial submission
    Id?: number,
    Title: string,
    RequestDate: string,
    ReceivedDate: string,
    RequesterId: number,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEOId: number,
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
    // undefined when submitting but will be filled in in the response from SP
    __metadata?: {
        etag: string
    }
}

/**
 * This interface is meant to model exactly what SP will return in the GET endpoint responses.
 * It is meant to only be an internal interface and should not be used outside of communicating with the SP API.
 */
interface SPRequirementsRequest {
    Id: number,
    Title: string,
    RequestDate: string,
    ReceivedDate: string,
    Requester: IPerson,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    ApprovingPEO: IPerson,
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
    __metadata: {
        etag: string
    }
}

export interface IRequirementsRequestApi {
    /**
     * Fetch the most up to date RequirementsRequest with the given Id
     * 
     * @param Id The Id of the RequirementsRequest to be fetched
     */
    fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | undefined>,

    /**
     * Fetch all of the RequirementsRequests
     */
    fetchRequirementsRequests(userId?: number): Promise<IRequirementsRequestCRUD[]>,

    /**
     * Submit/update/persist the given RequirementsRequest
     * 
     * @param requirementsRequest The RequirementsRequest to be saved/updated
     */
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD>,

    /**
     * Remove the given RequirementsRequest
     * 
     * @param requirementsRequest The RequirementsRequest to be deleted/removed
     */
    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void>
}

export default class RequirementsRequestsApi implements IRequirementsRequestApi {

    requirementsRequestList = spWebContext.lists.getByTitle("RequirementsRequests");
    userApi = UserApiConfig.getApi();
    requestApprovalsApi = RequestApprovalsApiConfig.getApi();

    // Map the given IRequirementsRequest to a ISubmitRequirementsRequest so that it can be submitted to SP
    private getSubmitRequirementsRequest = async (request: IRequirementsRequest): Promise<ISubmitRequirementsRequest> => {
        return {
            Id: request.Id,
            Title: request.Title,
            RequestDate: request.RequestDate.toISOString(),
            ReceivedDate: request.ReceivedDate.toISOString(),
            // If the RequesterId is not known, then get the current user from the UserApi and use that
            RequesterId: request.Requester.Id > -1 ? request.Requester.Id : (await this.userApi.getCurrentUser()).Id,
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            // If the ApprovingPEOId is not known then "ensureUser" to add the user to the SP site and get their Id
            ApprovingPEOId: request.ApprovingPEO.Id > -1 ? request.ApprovingPEO.Id : await this.userApi.getUserId(request.ApprovingPEO.EMail),
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

    // Map the given SPRequirementsRequest returned by SP to an IRequirementsRequest to be used interally
    private getIRequirementsRequest = (request: SPRequirementsRequest, approval?: IRequestApproval): IRequirementsRequest => {
        return approval ? approval.Request : {
            Id: request.Id,
            Title: request.Title,
            RequestDate: moment(request.RequestDate),
            ReceivedDate: moment(request.ReceivedDate),
            Requester: new Person(request.Requester),
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            ApprovingPEO: new Person(request.ApprovingPEO),
            PEOApprovedDateTime: null,
            PEOApprovedComment: null,
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
            "odata.etag": request.__metadata.etag
        }
    }

    async fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD> {
        try {
            let request: SPRequirementsRequest = await this.requirementsRequestList.items.getById(Id).select("Id", "Title", "RequestDate", "ReceivedDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "ApprovingPEO/Id", "ApprovingPEO/Title", "ApprovingPEO/EMail", "PEOOrgSymbol", "PEO_DSNPhone", "PEO_CommPhone", "RequirementType", "FundingOrgOrPEO", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Requester", "ApprovingPEO").get();
            let approval = await this.requestApprovalsApi.getRequestApproval(request.Id, request.ApprovingPEO.Id);
            // SP will return an SPRequirementsRequest, so we form that into an IRequirementsRequest, and create a RequirementRequest with that
            return new RequirementsRequest(this.getIRequirementsRequest(request, approval));
        } catch (e) {
            console.error(`Error occurred while trying to fetch Request with ID ${Id}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Request with ID ${Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Request with ID ${Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Request with ID ${Id}`);
            }
        }
    }

    async fetchRequirementsRequests(userId?: number): Promise<IRequirementsRequestCRUD[]> {
        try {
            // TODO: Change this so that it filters on IsDeleted: false
            let query = this.requirementsRequestList.items.select("Id", "Title", "RequestDate", "ReceivedDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "ApprovingPEO/Id", "ApprovingPEO/Title", "ApprovingPEO/EMail", "PEOOrgSymbol", "PEO_DSNPhone", "PEO_CommPhone", "RequirementType", "FundingOrgOrPEO", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Requester", "ApprovingPEO");

            if (userId !== undefined) {
                query = query.filter(`AuthorId eq ${userId} or Requester/Id eq ${userId} or ApprovingPEO/Id eq ${userId}`);
            }

            let pagedRequests = await query.getPaged();
            let requests: SPRequirementsRequest[] = pagedRequests.results;
            while (pagedRequests.hasNext) {
                requests = requests.concat((await pagedRequests.getNext()).results);
            }
            let approvals = await this.requestApprovalsApi.getRequestApprovals(requests.map(request => {
                return { requestId: request.Id, approverId: request.ApprovingPEO.Id }
            }));
            let requirementRequestCRUDs: IRequirementsRequestCRUD[] = [];
            for (let request of requests) {
                requirementRequestCRUDs.push(new RequirementsRequest(
                    this.getIRequirementsRequest(request,
                        approvals.find(approval =>
                            approval.Request.Id === request.Id && approval.AuthorId === request.ApprovingPEO.Id))
                    , this));
            }
            return requirementRequestCRUDs;
        } catch (e) {
            console.error(`Error occurred while trying to fetch Requests from SharePoint${userId ? " for userId " + userId : ""}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e,
                    `Error occurred while trying to fetch Requests from SharePoint${userId ? " for userId " + userId : ""}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(
                    `Error occurred while trying to fetch Requests from SharePoint${userId ? " for userId " + userId : ""}: ${e}`));
            } else {
                throw new ApiError(undefined,
                    `Unknown error occurred while trying to fetch Requests from SharePoint${userId ? " for userId " + userId : ""}:`);
            }
        }
    }

    async submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        let request = new RequirementsRequest(requirementsRequest);
        if (!request.isReadOnly()) {
            return request.Id > -1 ?
                this.updateRequest(request) :
                this.submitNewRequest(request);
        } else {
            throw new NotAuthorizedError();
        }
    }

    deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void> {
        try {
            // TODO: update this so that it simply changes the Request to have IsDeleted: true
            return this.requirementsRequestList.items.getById(requirementsRequest.Id).delete();
        } catch (e) {
            console.error(`Error occurred while trying to delete Request with ID ${requirementsRequest.Id}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to delete Request with ID ${requirementsRequest.Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to delete Request with ID ${requirementsRequest.Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to delete Request with ID ${requirementsRequest.Id}`);
            }
        }
    }

    private async updateRequest(requirementsRequest: IRequirementsRequestCRUD): Promise<IRequirementsRequestCRUD> {
        try {
            let submitRequest = await this.getSubmitRequirementsRequest(requirementsRequest);
            let returnedRequest = requirementsRequest;
            returnedRequest["odata.etag"] = (await this.requirementsRequestList.items.getById(requirementsRequest.Id)
                .update(submitRequest, requirementsRequest["odata.etag"])).data["odata.etag"];
            return new RequirementsRequest(returnedRequest, this);
        } catch (e) {
            console.error(`Error occurred while trying to update Request with ID ${requirementsRequest.Id}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to update Request with ID ${requirementsRequest.Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to update Request with ID ${requirementsRequest.Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to update Request with ID ${requirementsRequest.Id}`);
            }
        }
    }

    private async submitNewRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        try {
            let submitRequest = await this.getSubmitRequirementsRequest(requirementsRequest);
            let returnedRequest = requirementsRequest;
            let returnedSubmitRequest: ISubmitRequirementsRequest = (await this.requirementsRequestList.items.add(submitRequest)).data;
            returnedRequest.Id = returnedSubmitRequest.Id ? returnedSubmitRequest.Id : -1;
            returnedRequest.Requester.Id = returnedSubmitRequest.RequesterId;
            returnedRequest.ApprovingPEO.Id = returnedSubmitRequest.ApprovingPEOId;
            returnedRequest["odata.etag"] = returnedSubmitRequest.__metadata ? returnedSubmitRequest.__metadata.etag : "";
            return new RequirementsRequest(returnedRequest, this);
        } catch (e) {
            console.error("Error occured while trying to submit a new request");
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to submit a new Request: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to submit a new Request: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to submit a new Request`);
            }
        }
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