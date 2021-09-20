import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, NoveltyRequirementTypes, OrgPriorities, RequestStatuses, RequirementsRequest } from "./DomainObjects";
import RequirementsRequestsApiDev from "./RequirementsRequestsApiDev";
import { spWebContext } from "../providers/SPWebContext";
import moment, { Moment } from "moment";
import { UserApiConfig, Person, IPerson } from "./UserApi";
import { RequestApprovalsApiConfig, IRequestApproval } from "./RequestApprovalsApi";
import { ApiError, NotAuthorizedError, InternalError } from "./InternalErrors";

export interface DateRange {
    start: Moment | null,
    end: Moment | null
}

export function isDateRange(dateRange: any): dateRange is DateRange {
    return (dateRange as DateRange).start !== undefined && (dateRange as DateRange).end !== undefined
}

export function isIPerson(person: any): person is IPerson {
    return (person as IPerson).Id !== undefined
        && (person as IPerson).Title !== undefined
        && (person as IPerson).EMail !== undefined
}

export type FilterField = "Id" | "Title" | "Requester" | "RequestDate" | "ApplicationNeeded" | "OrgPriority" | "OperationalNeedDate" | "Status" | "Modified";
export type FilterValue = string | IPerson | DateRange | RequestStatuses;

export interface RequestFilter {
    // Name of the field that the filter is being applied for
    fieldName: FilterField,
    // The value of the search for filtering
    filterValue: FilterValue,
    // Used to determine if the field should start with or just contain the value. Only valid for string fields.
    isStartsWith?: boolean
}

/**
 * This interface is used to submit/update requests to SP and it also models what SP returns from those endpoints.
 * It is meant to only be an internal interface and should not be used outside of communicating with the SP API.
 */
interface ISubmitRequirementsRequest {
    // can be undefined if it is an intial submission
    Id?: number,
    Title: string,
    Status: RequestStatuses,
    StatusDateTime: string,
    RequestDate: string,
    RequesterId: number,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string | null,
    RequesterCommPhone: string,
    ApproverId: number,
    ApproverOrgSymbol: string,
    ApproverDSNPhone: string | null,
    ApproverCommPhone: string,
    NoveltyRequirementType: NoveltyRequirementTypes,
    FundingOrgOrDeputy: string,
    ApplicationNeeded: ApplicationTypes,
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: boolean,
    ProjectedOrgsImpactedCenter: Centers,
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: number | null,
    OperationalNeedDate: string | null,
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
    Status: RequestStatuses,
    StatusDateTime: string,
    RequestDate: string,
    Author: IPerson,
    Requester: IPerson,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string | null,
    RequesterCommPhone: string,
    Approver: IPerson,
    ApproverOrgSymbol: string,
    ApproverDSNPhone: string | null,
    ApproverCommPhone: string,
    NoveltyRequirementType: NoveltyRequirementTypes,
    FundingOrgOrDeputy: string,
    ApplicationNeeded: ApplicationTypes,
    OtherApplicationNeeded: string,
    IsProjectedOrgsEnterprise: boolean,
    ProjectedOrgsImpactedCenter: Centers,
    ProjectedOrgsImpactedOrg: string,
    ProjectedImpactedUsers: number | null,
    OperationalNeedDate: string | null,
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
    fetchRequirementsRequests(filters: RequestFilter[], sortBy?: FilterField, ascending?: boolean, userId?: number): Promise<IRequirementsRequestCRUD[]>,

    /**
     * Submit/update/persist the given RequirementsRequest
     * 
     * @param requirementsRequest The RequirementsRequest to be saved/updated
     */
    submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD>,

    /**
     * Update the status of the given IRequirementsRequest.
     * 
     * @param requirementsRequest The IRequirementsRequest whose status is being updated.
     */
    updateRequestStatus(requirementsRequest: IRequirementsRequest, status: RequestStatuses): Promise<IRequirementsRequestCRUD>
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
            Status: request.Status,
            StatusDateTime: request.StatusDateTime.toISOString(),
            RequestDate: request.RequestDate.toISOString(),
            // If the RequesterId is not known, then get the current user from the UserApi and use that
            RequesterId: request.Requester.Id > -1 ? request.Requester.Id : await this.userApi.getUserId(request.Requester.EMail),
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            // If the ApproverId is not known then "ensureUser" to add the user to the SP site and get their Id
            ApproverId: request.Approver.Id > -1 ? request.Approver.Id : await this.userApi.getUserId(request.Approver.EMail),
            ApproverOrgSymbol: request.ApproverOrgSymbol,
            ApproverDSNPhone: request.ApproverDSNPhone,
            ApproverCommPhone: request.ApproverCommPhone,
            NoveltyRequirementType: request.NoveltyRequirementType,
            FundingOrgOrDeputy: request.FundingOrgOrDeputy,
            ApplicationNeeded: request.ApplicationNeeded,
            OtherApplicationNeeded: request.OtherApplicationNeeded,
            IsProjectedOrgsEnterprise: request.IsProjectedOrgsEnterprise,
            ProjectedOrgsImpactedCenter: request.ProjectedOrgsImpactedCenter,
            ProjectedOrgsImpactedOrg: request.ProjectedOrgsImpactedOrg,
            ProjectedImpactedUsers: request.ProjectedImpactedUsers,
            OperationalNeedDate: request.OperationalNeedDate ? request.OperationalNeedDate.toISOString() : null,
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
            Status: request.Status,
            StatusDateTime: moment(request.StatusDateTime),
            RequestDate: moment(request.RequestDate),
            Author: new Person(request.Author),
            Requester: new Person(request.Requester),
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            Approver: new Person(request.Approver),
            ApproverOrgSymbol: request.ApproverOrgSymbol,
            ApproverDSNPhone: request.ApproverDSNPhone,
            ApproverCommPhone: request.ApproverCommPhone,
            NoveltyRequirementType: request.NoveltyRequirementType,
            FundingOrgOrDeputy: request.FundingOrgOrDeputy,
            ApplicationNeeded: request.ApplicationNeeded,
            OtherApplicationNeeded: request.OtherApplicationNeeded,
            IsProjectedOrgsEnterprise: request.IsProjectedOrgsEnterprise,
            ProjectedOrgsImpactedCenter: request.ProjectedOrgsImpactedCenter,
            ProjectedOrgsImpactedOrg: request.ProjectedOrgsImpactedOrg,
            ProjectedImpactedUsers: request.ProjectedImpactedUsers,
            OperationalNeedDate: request.OperationalNeedDate ? moment(request.OperationalNeedDate) : null,
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

    async fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | undefined> {
        try {
            let request: SPRequirementsRequest = await this.requirementsRequestList.items.getById(Id).select("Id", "Title", "Status", "StatusDateTime", "RequestDate", "Author/Id", "Author/Title", "Author/EMail", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "Approver/Id", "Approver/Title", "Approver/EMail", "ApproverOrgSymbol", "ApproverDSNPhone", "ApproverCommPhone", "NoveltyRequirementType", "FundingOrgOrDeputy", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Author", "Requester", "Approver").get();
            if (!this.isRequestClosed(request)) {
                // Only try to fetch the approval if the request is approved or further
                let approval = this.isRequestApproved(request) ? await this.requestApprovalsApi.getRequestApproval(this.getIRequirementsRequest(request)) : undefined;
                // SP will return an SPRequirementsRequest, so we form that into an IRequirementsRequest, and create a RequirementRequest with that
                return new RequirementsRequest(this.getIRequirementsRequest(request, approval));
            } else {
                return undefined;
            }
        } catch (e) {
            console.error(`Error occurred while trying to fetch Request with ID ${Id}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e.status === 404) {
                // return undefined when SP cannot find the request
                return undefined;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Request with ID ${Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Request with ID ${Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Request with ID ${Id}`);
            }
        }
    }

    async fetchRequirementsRequests(filters: RequestFilter[], sortBy: FilterField = "Modified", ascending: boolean = false, userId?: number): Promise<IRequirementsRequestCRUD[]> {
        try {
            let query = this.requirementsRequestList.items.select("Id", "Title", "Status", "StatusDateTime", "RequestDate", "Author/Id", "Author/Title", "Author/EMail", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "Approver/Id", "Approver/Title", "Approver/EMail", "ApproverOrgSymbol", "ApproverDSNPhone", "ApproverCommPhone", "NoveltyRequirementType", "FundingOrgOrDeputy", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Author", "Requester", "Approver");

            // Only show unsubmitted/saved requests if they are the author
            let queryString = `(AuthorId eq ${(await this.userApi.getCurrentUser()).Id} or Status ne '${RequestStatuses.SAVED}')`;
            // only filter out cancelled/closed requests if there are no filters for that field
            if (filters.findIndex(f => f.fieldName === "Status") < 0) {
                queryString += ` and Status ne '${RequestStatuses.CANCELLED}' and Status ne '${RequestStatuses.CLOSED}'`
            }

            if (userId !== undefined) {
                queryString += ` and (AuthorId eq ${userId} or Requester/Id eq ${userId} or Approver/Id eq ${userId})`;
            }

            for (let filter of filters) {
                if (isDateRange(filter.filterValue)) {
                    if (filter.filterValue.start !== null) {
                        queryString += ` and ${filter.fieldName} ge '${moment(filter.filterValue.start).startOf('day').format()}'`;
                    }
                    if (filter.filterValue.end !== null) {
                        queryString += ` and ${filter.fieldName} le '${moment(filter.filterValue.end).add({ days: 1 }).startOf('day').format()}'`;
                    }
                } else if (isIPerson(filter.filterValue)) {
                    queryString += ` and ${filter.fieldName}Id eq ${await this.userApi.getUserId(filter.filterValue.EMail)}`;
                } else if (filter.fieldName === "ApplicationNeeded" || filter.fieldName === "OrgPriority" || filter.fieldName === "Status") {
                    queryString += ` and ${filter.fieldName} eq '${filter.filterValue}'`;
                } else if (filter.fieldName === "Id") {
                    queryString += " and (";
                    // allows a list of IDs separated by commas to be entered and fetches all of them
                    let filterIds = filter.filterValue.split(',');
                    for (let i = 0; i < filterIds.length; ++i) {
                        // remove the 'OZI' and leading zeroes from the search
                        let idFilter = filterIds[i].trim().toUpperCase().replace("OZI", "");
                        while (idFilter.startsWith('0')) {
                            idFilter = idFilter.substr(1);
                        }
                        queryString += `${i > 0 ? " or " : ""}${filter.isStartsWith ? `startswith(${filter.fieldName},'${idFilter}')` : `substringof('${idFilter}',${filter.fieldName})`}`;
                    }
                    queryString += ")"
                } else if (typeof (filter.filterValue) === "string") {
                    queryString += ` and ${filter.isStartsWith ? `startswith(${filter.fieldName},'${filter.filterValue}')` : `substringof('${filter.filterValue}',${filter.fieldName})`}`;
                }
            }

            let pagedRequests = await query.filter(queryString).orderBy(sortBy, ascending).getPaged();
            let requests: SPRequirementsRequest[] = pagedRequests.results;
            while (pagedRequests.hasNext) {
                requests = requests.concat((await pagedRequests.getNext()).results);
            }
            // get all of the approval requests and overwrite the base data with them
            let approvals = await this.requestApprovalsApi.getRequestApprovals(requests
                // only fetch approvals for requests that are approved or further
                .filter(request => this.isRequestApproved(request))
                .map(request => this.getIRequirementsRequest(request)));
            let requirementRequestCRUDs: IRequirementsRequestCRUD[] = [];
            for (let request of requests) {
                requirementRequestCRUDs.push(new RequirementsRequest(
                    this.getIRequirementsRequest(request,
                        approvals.find(approval =>
                            approval.Request.Id === request.Id && approval.AuthorId === request.Approver.Id))
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
        if (!request.isReadOnly(await this.userApi.getCurrentUser(), await this.userApi.getCurrentUsersRoles())) {
            return request.Id > -1 ?
                this.updateRequest(request) :
                this.submitNewRequest(request);
        } else {
            throw new NotAuthorizedError();
        }
    }

    async updateRequestStatus(requirementsRequest: IRequirementsRequest, status: RequestStatuses): Promise<IRequirementsRequestCRUD> {
        try {
            let submitTime = moment();
            let submitRequest = { Status: status, StatusDateTime: submitTime.toISOString() };
            let returnedRequest = new RequirementsRequest(requirementsRequest, this);
            returnedRequest["odata.etag"] = (await this.requirementsRequestList.items.getById(requirementsRequest.Id)
                .update(submitRequest, requirementsRequest["odata.etag"])).data["odata.etag"];
            returnedRequest.Status = status;
            returnedRequest.StatusDateTime = submitTime;
            return returnedRequest;
        } catch (e) {
            console.error(`Error occurred while trying to update the status of Request with ID ${requirementsRequest.Id}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to update the status of Request with ID ${requirementsRequest.Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to update the status of Request with ID ${requirementsRequest.Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to update the status of Request with ID ${requirementsRequest.Id}`);
            }
        }
    }

    /**
     * Returns true if the Request has a Statuse of Approved or further
     * @param request The request being checked
     */
    private isRequestApproved(request: SPRequirementsRequest): boolean {
        return request.Status === RequestStatuses.APPROVED
            || request.Status === RequestStatuses.ACCEPTED
            || request.Status === RequestStatuses.CITO_APPROVED
            || request.Status === RequestStatuses.REVIEW
            || request.Status === RequestStatuses.CONTRACT;
    }

    /**
     * Returns true if the Request is in any of the closed/cancelled states.
     * @param request The request being checked
     */
    private isRequestClosed(request: SPRequirementsRequest): boolean {
        return request.Status === RequestStatuses.CANCELLED
            || request.Status === RequestStatuses.CLOSED
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
            returnedRequest.Approver.Id = returnedSubmitRequest.ApproverId;
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