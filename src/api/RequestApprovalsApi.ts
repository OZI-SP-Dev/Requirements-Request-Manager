import moment, { Moment } from "moment";
import { spWebContext } from "../providers/SPWebContext";
import { ApplicationTypes, Centers, IRequirementsRequest, OrgPriorities, RequirementsRequest, RequirementTypes } from "./DomainObjects";
import { ApiError, InternalError, NotAuthorizedError } from "./InternalErrors";
import { IRequirementsRequestApi } from "./RequirementsRequestsApi";
import { IPerson, IUserApi, Person, UserApiConfig } from "./UserApi";


export interface IRequestApproval {
    Id: number,
    Comment: string,
    Created: Moment,
    AuthorId: number,
    Request: IRequirementsRequest,
}

interface SPRequestApproval {
    Id: number,
    // This is the approver's comment field
    Title: string,
    // this is a date-time in ISO format
    Created: string,
    AuthorId: number,

    // RequirementsRequest fields below

    // This field is used by SP for the GET endpoints and is expanded as it is a lookup field
    Request: { Id: number },
    RequestTitle: string,
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

interface ISubmitRequestApproval {
    Id?: number,
    Title: string,
    Created?: string,
    AuthorId?: number,

    // RequirementsRequest fields below
    RequestId: number,
    RequestTitle: string,
    RequestDate: string,
    ReceivedDate?: string,
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

export interface IRequestApprovalsApi {
    /**
     * Get the RequestApproval for a given requestId and approverId.
     * Only returns a valid RequestApproval if one exists for the given params.
     * A valid RequestApproval being returned indicates that the Request was approved by the requested approver.
     * 
     * @param requestId The Id of the request whose approval is being searched for
     * @param approverId The Id of the user who should have approved the Request
     * 
     * @returns An IRequestApproval if one is found for the given params or undefined/null otherwise
     */
    getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined>

    /**
     * This should be used to get a bulk number of IRequestApprovals, and will
     * probably mostly be used when presenting a list of Requests.
     * 
     * @param requestIds The list of Ids of the requests whose approvals are being searched for
     */
    getRequestApprovals(requests: { requestId: number, approverId: number }[]): Promise<IRequestApproval[]>

    /**
     * Submit an approval for a Request
     * 
     * @param requestId The Id of the request being approved
     * @param comment An optional one line comment for the request's approval
     * 
     * @returns An IRequestApproval of the new approval submitted
     */
    submitApproval(request: IRequirementsRequest, comment: string): Promise<IRequestApproval>;
}

export class RequestApprovalsApi implements IRequestApprovalsApi {

    requestApprovalsList = spWebContext.lists.getByTitle("RequestApprovals");
    userApi: IUserApi = UserApiConfig.getApi();

    async getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined> {
        try {
            let requestApproval: SPRequestApproval = (await this.requestApprovalsList.items.select("Id", "Request/Id", "Title", "Created", "AuthorId", "RequestTitle", "RequestDate", "ReceivedDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "ApprovingPEO/Id", "ApprovingPEO/Title", "ApprovingPEO/EMail", "PEOOrgSymbol", "PEO_DSNPhone", "PEO_CommPhone", "RequirementType", "FundingOrgOrPEO", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").filter(`RequestId eq ${requestId} and AuthorId eq ${approverId}`).expand("Request", "Requester", "ApprovingPEO").get())[0];
            return requestApproval ? this.spApprovalToRequestApproval(requestApproval) : undefined;
        } catch (e) {
            console.error(`Error occurred while trying to fetch Approval for Request with ID ${requestId}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Approval for Request with ID ${requestId}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Approval for Request with ID ${requestId}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Approval for Request with ID ${requestId}`);
            }
        }
    }

    async getRequestApprovals(requests: { requestId: number, approverId: number }[]): Promise<IRequestApproval[]> {
        try {
            let pages = await this.requestApprovalsList.items.select("Id", "Request/Id", "Title", "Created", "AuthorId", "RequestTitle", "RequestDate", "ReceivedDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "ApprovingPEO/Id", "ApprovingPEO/Title", "ApprovingPEO/EMail", "PEOOrgSymbol", "PEO_DSNPhone", "PEO_CommPhone", "RequirementType", "FundingOrgOrPEO", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Request", "Requester", "ApprovingPEO").getPaged();
            let approvals: SPRequestApproval[] = pages.results;
            while (pages.hasNext) {
                approvals = approvals.concat((await pages.getNext()).results);
            }
            return approvals
                .filter(approval =>
                    requests.findIndex(request => request.requestId === approval.Request.Id && request.approverId === approval.AuthorId) > -1)
                .map(approval => this.spApprovalToRequestApproval(approval))
        } catch (e) {
            let requestIds = requests.map((req, i) => `${req.requestId}${i < requests.length - 1 ? ", " : ""}`);
            console.error(`Error occurred while trying to fetch Approvals for Requests with IDs in [${requestIds}]`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Approvals for Requests with IDs in [${requestIds}]: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Approvals for Requests with IDs in [${requestIds}]: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Approvals for Requests with IDs in [${requestIds}]`);
            }
        }
    }

    async submitApproval(request: IRequirementsRequest, comment: string): Promise<IRequestApproval> {
        try {
            let requestCrud = new RequirementsRequest(request);
            if (!requestCrud.isReadOnly(await this.userApi.getCurrentUser(), await this.userApi.getCurrentUsersRoles())) {
                if ((await this.userApi.getCurrentUser()).Id === request.ApprovingPEO.Id) {
                    let requestApproval: ISubmitRequestApproval = (await this.requestApprovalsList.items.add(this.requirementsRequestToSubmitApproval(request, comment))).data;

                    return this.submitApprovalToRequestApproval(requestApproval, requestCrud);
                } else {
                    throw new NotAuthorizedError(new Error("You cannot approve a Request for which you are not the approver!"));
                }
            } else {
                throw new NotAuthorizedError(new Error("You cannot approve a Request that has already been approved!"));
            }
        } catch (e) {
            console.error(`Error occured while trying to approve Request with ID ${request.Id}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occured while trying to approve Request with ID ${request.Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occured while trying to approve Request with ID ${request.Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to approve Request with ID ${request.Id}`);
            }
        }
    }

    private requirementsRequestToSubmitApproval(request: IRequirementsRequest, comment: string): ISubmitRequestApproval {
        return {
            Title: comment,
            RequestId: request.Id,
            RequestTitle: request.Title,
            RequestDate: request.RequestDate.toISOString(),
            ReceivedDate: request.ReceivedDate?.toISOString(),
            RequesterId: request.Requester.Id,
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            ApprovingPEOId: request.ApprovingPEO.Id,
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

    private spApprovalToRequestApproval(spApproval: SPRequestApproval): IRequestApproval {
        return {
            Id: spApproval.Id,
            Comment: spApproval.Title,
            Created: moment(spApproval.Created),
            AuthorId: spApproval.AuthorId,
            Request: new RequirementsRequest({
                Id: spApproval.Request.Id,
                Title: spApproval.RequestTitle,
                RequestDate: moment(spApproval.RequestDate),
                ReceivedDate: moment(spApproval.ReceivedDate),
                Requester: new Person(spApproval.Requester),
                RequesterOrgSymbol: spApproval.RequesterOrgSymbol,
                RequesterDSNPhone: spApproval.RequesterDSNPhone,
                RequesterCommPhone: spApproval.RequesterCommPhone,
                ApprovingPEO: new Person(spApproval.ApprovingPEO),
                PEOApprovedDateTime: moment(spApproval.Created),
                PEOApprovedComment: spApproval.Title,
                PEOOrgSymbol: spApproval.PEOOrgSymbol,
                PEO_DSNPhone: spApproval.PEO_DSNPhone,
                PEO_CommPhone: spApproval.PEO_CommPhone,
                RequirementType: spApproval.RequirementType,
                FundingOrgOrPEO: spApproval.FundingOrgOrPEO,
                ApplicationNeeded: spApproval.ApplicationNeeded,
                OtherApplicationNeeded: spApproval.OtherApplicationNeeded,
                IsProjectedOrgsEnterprise: spApproval.IsProjectedOrgsEnterprise,
                ProjectedOrgsImpactedCenter: spApproval.ProjectedOrgsImpactedCenter,
                ProjectedOrgsImpactedOrg: spApproval.ProjectedOrgsImpactedOrg,
                ProjectedImpactedUsers: spApproval.ProjectedImpactedUsers,
                OperationalNeedDate: moment(spApproval.OperationalNeedDate),
                OrgPriority: spApproval.OrgPriority,
                PriorityExplanation: spApproval.PriorityExplanation,
                BusinessObjective: spApproval.BusinessObjective,
                FunctionalRequirements: spApproval.FunctionalRequirements,
                Benefits: spApproval.Benefits,
                Risk: spApproval.Risk,
                AdditionalInfo: spApproval.AdditionalInfo,
                "odata.etag": spApproval.__metadata.etag
            })
        }
    }

    private submitApprovalToRequestApproval(requestApproval: ISubmitRequestApproval, submittedRequest: IRequirementsRequest): IRequestApproval {
        return {
            Id: requestApproval.Id ? requestApproval.Id : -1,
            Comment: requestApproval.Title,
            Created: moment(requestApproval.Created),
            AuthorId: requestApproval.AuthorId ? requestApproval.AuthorId : -1,
            Request: new RequirementsRequest({
                Id: requestApproval.RequestId,
                Title: requestApproval.RequestTitle,
                RequestDate: moment(requestApproval.RequestDate),
                ReceivedDate: moment(requestApproval.ReceivedDate),
                Requester: submittedRequest.Requester,
                RequesterOrgSymbol: requestApproval.RequesterOrgSymbol,
                RequesterDSNPhone: requestApproval.RequesterDSNPhone,
                RequesterCommPhone: requestApproval.RequesterCommPhone,
                ApprovingPEO: submittedRequest.ApprovingPEO,
                PEOApprovedDateTime: moment(requestApproval.Created),
                PEOApprovedComment: requestApproval.Title,
                PEOOrgSymbol: requestApproval.PEOOrgSymbol,
                PEO_DSNPhone: requestApproval.PEO_DSNPhone,
                PEO_CommPhone: requestApproval.PEO_CommPhone,
                RequirementType: requestApproval.RequirementType,
                FundingOrgOrPEO: requestApproval.FundingOrgOrPEO,
                ApplicationNeeded: requestApproval.ApplicationNeeded,
                OtherApplicationNeeded: requestApproval.OtherApplicationNeeded,
                IsProjectedOrgsEnterprise: requestApproval.IsProjectedOrgsEnterprise,
                ProjectedOrgsImpactedCenter: requestApproval.ProjectedOrgsImpactedCenter,
                ProjectedOrgsImpactedOrg: requestApproval.ProjectedOrgsImpactedOrg,
                ProjectedImpactedUsers: requestApproval.ProjectedImpactedUsers,
                OperationalNeedDate: moment(requestApproval.OperationalNeedDate),
                OrgPriority: requestApproval.OrgPriority,
                PriorityExplanation: requestApproval.PriorityExplanation,
                BusinessObjective: requestApproval.BusinessObjective,
                FunctionalRequirements: requestApproval.FunctionalRequirements,
                Benefits: requestApproval.Benefits,
                Risk: requestApproval.Risk,
                AdditionalInfo: requestApproval.AdditionalInfo,
                "odata.etag": requestApproval.__metadata ? requestApproval.__metadata.etag : ""
            })
        }
    }
}

export class RequestApprovalsApiDev implements IRequestApprovalsApi {

    userApi: IUserApi;
    approvals: IRequestApproval[];
    maxId: number;

    constructor(requestsApi?: IRequirementsRequestApi) {
        this.userApi = UserApiConfig.getApi();

        this.approvals = [{
            Id: 1,
            Comment: "Super approval",
            Created: moment(),
            AuthorId: 2,
            Request: new RequirementsRequest({
                Id: 1,
                Title: "New Title, Overwriting the Base Title",
                RequestDate: moment(),
                ReceivedDate: moment(),
                Requester: new Person({
                    Id: 1,
                    Title: "Jeremy Clark",
                    EMail: "jeremyclark@superemail.com"
                }),
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                ApprovingPEO: new Person({
                    Id: 2,
                    Title: "Robert Porterfield",
                    EMail: "robertporterfield@superemail.com"
                }),
                PEOApprovedDateTime: moment(),
                PEOApprovedComment: "Super approval",
                PEOOrgSymbol: "OZI",
                PEO_DSNPhone: "1234567890",
                PEO_CommPhone: "1234567890",
                RequirementType: RequirementTypes.NEW_CAP,
                FundingOrgOrPEO: "OZI",
                ApplicationNeeded: ApplicationTypes.CCaR,
                OtherApplicationNeeded: "",
                IsProjectedOrgsEnterprise: false,
                ProjectedOrgsImpactedCenter: Centers.AFIMSC,
                ProjectedOrgsImpactedOrg: "OZIC",
                ProjectedImpactedUsers: 12,
                OperationalNeedDate: moment(),
                OrgPriority: OrgPriorities.MEDIUM,
                PriorityExplanation: "It's pretty medium, low is too low and high is too high.",
                BusinessObjective: "We want a thing to do the thing.",
                FunctionalRequirements: "It definitely has to do the thing.",
                Benefits: "It will do the thing so that we don't have to.",
                Risk: "We will forget how to do the thing.",
                AdditionalInfo: "We <3 you guys.",
                "odata.etag": "1"
            }, requestsApi)
        }, {
            Id: 2,
            Comment: "bad approval",
            Created: moment(),
            AuthorId: 3,
            Request: new RequirementsRequest({
                Id: 2,
                Title: "Shouldn't appear",
                RequestDate: moment(),
                ReceivedDate: moment(),
                Requester: new Person({
                    Id: 2,
                    Title: "Robert Porterfield",
                    EMail: "robertporterfield@superemail.com"
                }),
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                ApprovingPEO: new Person({
                    Id: 1,
                    Title: "Jeremy Clark",
                    EMail: "jeremyclark@superemail.com"
                }),
                PEOApprovedDateTime: null,
                PEOApprovedComment: null,
                PEOOrgSymbol: "OZI",
                PEO_DSNPhone: "1234567890",
                PEO_CommPhone: "1234567890",
                RequirementType: RequirementTypes.MOD_EXISTING_CAP,
                FundingOrgOrPEO: "",
                ApplicationNeeded: ApplicationTypes.OTHER,
                OtherApplicationNeeded: "Super App",
                IsProjectedOrgsEnterprise: true,
                ProjectedOrgsImpactedCenter: Centers.AFLCMC,
                ProjectedOrgsImpactedOrg: "OZIC",
                ProjectedImpactedUsers: 50,
                OperationalNeedDate: moment(),
                OrgPriority: OrgPriorities.HIGH,
                PriorityExplanation: "It's super important, we can't live without it.",
                BusinessObjective: "We want a thing to do the thing.",
                FunctionalRequirements: "It definitely has to do the thing.",
                Benefits: "It will do the thing so that we don't have to.",
                Risk: "We will forget how to do the thing.",
                AdditionalInfo: "We <3 you guys.",
                "odata.etag": "2"
            }, requestsApi)
        }];

        this.maxId = 2;
    }

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    async getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined> {
        await this.sleep();
        let approval = this.approvals.find(approval => approval.Request.Id === requestId && approval.AuthorId === approverId);
        if (approval) {
            approval.Request.PEOApprovedDateTime = approval.Created;
            approval.Request.PEOApprovedComment = approval.Comment;
        }
        return approval;
    }

    async getRequestApprovals(requests: { requestId: number, approverId: number }[]): Promise<IRequestApproval[]> {
        await this.sleep();
        return this.approvals.filter(approval =>
            requests.findIndex(request => request.requestId === approval.Request.Id && request.approverId === approval.AuthorId) > -1)
            .map(approval => {
                return {
                    ...approval,
                    Request: { ...approval.Request, PEOApprovedDateTime: approval.Created, PEOApprovedComment: approval.Comment }
                }
            });
    }

    async submitApproval(request: IRequirementsRequest, comment: string): Promise<IRequestApproval> {
        let requestCrud = new RequirementsRequest(request);
        if (!requestCrud.isReadOnly(await this.userApi.getCurrentUser(), await this.userApi.getCurrentUsersRoles())) {
            if ((await this.userApi.getCurrentUser()).Id === request.ApprovingPEO.Id) {
                let newApproval: IRequestApproval = {
                    Id: ++this.maxId,
                    Comment: comment,
                    Created: moment(),
                    AuthorId: (await this.userApi.getCurrentUser()).Id,
                    Request: new RequirementsRequest(request)
                }
                this.approvals.push(newApproval);
                return newApproval;
            } else {
                throw new Error("You cannot approve a Request for which you are not the approver!");
            }
        } else {
            throw new Error("You cannot approve a Request that has already been approved!");
        }
    }
}

export class RequestApprovalsApiConfig {
    private static requestApprovalsApi: IRequestApprovalsApi

    // optionally supply the api used to set up test data in the dev version
    static getApi(requestsApi?: IRequirementsRequestApi): IRequestApprovalsApi {
        if (!this.requestApprovalsApi) {
            this.requestApprovalsApi = process.env.NODE_ENV === 'development' ? new RequestApprovalsApiDev(requestsApi) : new RequestApprovalsApi();
        }
        return this.requestApprovalsApi;
    }
}