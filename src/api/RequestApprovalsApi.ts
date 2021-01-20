import moment, { Moment } from "moment";
import { spWebContext } from "../providers/SPWebContext";
import { ApplicationTypes, Centers, IRequirementsRequest, NoveltyRequirementTypes, OrgPriorities, RequestStatuses, RequirementsRequest } from "./DomainObjects";
import { ApiError, InternalError, NotAuthorizedError } from "./InternalErrors";
import { IRequirementsRequestApi } from "./RequirementsRequestsApi";
import { IPerson, IUserApi, Person, UserApiConfig } from "./UserApi";


export interface IRequestApproval {
    Id: number,
    Created: Moment,
    AuthorId: number,
    Request: IRequirementsRequest,
}

interface SPRequestApproval {
    Id: number,
    // this is a date-time in ISO format
    Created: string,
    AuthorId: number,

    // RequirementsRequest fields below

    // This field is used by SP for the GET endpoints and is expanded as it is a lookup field
    Request: { Id: number },
    RequestTitle: string,
    RequestDate: string,
    Requester: IPerson,
    RequesterOrgSymbol: string,
    RequesterDSNPhone: string,
    RequesterCommPhone: string,
    Approver: IPerson,
    ApproverOrgSymbol: string,
    ApproverDSNPhone: string,
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

interface ISubmitRequestApproval {
    Id?: number,
    Created?: string,
    AuthorId?: number,

    // RequirementsRequest fields below
    RequestId: number,
    RequestTitle: string,
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
    getRequestApproval(request: IRequirementsRequest): Promise<IRequestApproval | undefined>

    /**
     * This should be used to get a bulk number of IRequestApprovals, and will
     * probably mostly be used when presenting a list of Requests.
     * 
     * @param requestIds The list of Ids of the requests whose approvals are being searched for
     */
    getRequestApprovals(requests: IRequirementsRequest[]): Promise<IRequestApproval[]>

    /**
     * Submit an approval for a Request
     * 
     * @param requestId The Id of the request being approved
     * @param comment An optional one line comment for the request's approval
     * 
     * @returns An IRequestApproval of the new approval submitted
     */
    submitApproval(request: IRequirementsRequest): Promise<IRequestApproval>;
}

export class RequestApprovalsApi implements IRequestApprovalsApi {

    requestApprovalsList = spWebContext.lists.getByTitle("RequestApprovals");
    userApi: IUserApi = UserApiConfig.getApi();

    async getRequestApproval(request: IRequirementsRequest): Promise<IRequestApproval | undefined> {
        try {
            let requestApproval: SPRequestApproval = (await this.requestApprovalsList.items.select("Id", "Request/Id", "Created", "AuthorId", "RequestTitle", "RequestDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "Approver/Id", "Approver/Title", "Approver/EMail", "ApproverOrgSymbol", "ApproverDSNPhone", "ApproverCommPhone", "NoveltyRequirementType", "FundingOrgOrDeputy", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").filter(`RequestId eq ${request.Id} and AuthorId eq ${request.Approver.Id}`).expand("Request", "Requester", "Approver").orderBy("Created", false).get())[0];
            return requestApproval ? this.spApprovalToRequestApproval(requestApproval, request) : undefined;
        } catch (e) {
            console.error(`Error occurred while trying to fetch Approval for Request with ID ${request.Id}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Approval for Request with ID ${request.Id}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Approval for Request with ID ${request.Id}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Approval for Request with ID ${request.Id}`);
            }
        }
    }

    async getRequestApprovals(requests: IRequirementsRequest[]): Promise<IRequestApproval[]> {
        try {
            let pages = await this.requestApprovalsList.items.select("Id", "Request/Id", "Created", "AuthorId", "RequestTitle", "RequestDate", "Requester/Id", "Requester/Title", "Requester/EMail", "RequesterOrgSymbol", "RequesterDSNPhone", "RequesterCommPhone", "Approver/Id", "Approver/Title", "Approver/EMail", "ApproverOrgSymbol", "ApproverDSNPhone", "ApproverCommPhone", "NoveltyRequirementType", "FundingOrgOrDeputy", "ApplicationNeeded", "OtherApplicationNeeded", "IsProjectedOrgsEnterprise", "ProjectedOrgsImpactedCenter", "ProjectedOrgsImpactedOrg", "ProjectedImpactedUsers", "OperationalNeedDate", "OrgPriority", "PriorityExplanation", "BusinessObjective", "FunctionalRequirements", "Benefits", "Risk", "AdditionalInfo").expand("Request", "Requester", "Approver").orderBy("Created", false).getPaged();
            let approvals: SPRequestApproval[] = pages.results;
            while (pages.hasNext) {
                approvals = approvals.concat((await pages.getNext()).results);
            }
            let requestApprovals: IRequestApproval[] = [];
            for (let approval of approvals) {
                let request = requests.find(req => req.Id === approval.Request.Id && req.Approver.Id === approval.AuthorId);
                if (request) {
                    requestApprovals.push(this.spApprovalToRequestApproval(approval, request));
                }
            }
            return requestApprovals;
        } catch (e) {
            let requestIds = requests.map((req, i) => `${req.Id}${i < requests.length - 1 ? ", " : ""}`);
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

    async submitApproval(request: IRequirementsRequest): Promise<IRequestApproval> {
        try {
            let requestCrud = new RequirementsRequest(request);
            let currentUser = await this.userApi.getCurrentUser();
            if (currentUser.Id === request.Approver.Id) {
                let requestApproval: ISubmitRequestApproval = (await this.requestApprovalsList.items.add(this.requirementsRequestToSubmitApproval(request))).data;

                return this.submitApprovalToRequestApproval(requestApproval, requestCrud);
            } else {
                throw new NotAuthorizedError(new Error("You cannot approve a Request for which you are not the approver!"));
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

    private requirementsRequestToSubmitApproval(request: IRequirementsRequest): ISubmitRequestApproval {
        return {
            RequestId: request.Id,
            RequestTitle: request.Title,
            RequestDate: request.RequestDate.toISOString(),
            RequesterId: request.Requester.Id,
            RequesterOrgSymbol: request.RequesterOrgSymbol,
            RequesterDSNPhone: request.RequesterDSNPhone,
            RequesterCommPhone: request.RequesterCommPhone,
            ApproverId: request.Approver.Id,
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

    private spApprovalToRequestApproval(spApproval: SPRequestApproval, request: IRequirementsRequest): IRequestApproval {
        return {
            Id: spApproval.Id,
            Created: moment(spApproval.Created),
            AuthorId: spApproval.AuthorId,
            Request: new RequirementsRequest({
                Id: spApproval.Request.Id,
                Title: spApproval.RequestTitle,
                Status: request.Status,
                StatusDateTime: request.StatusDateTime,
                RequestDate: moment(spApproval.RequestDate),
                Author: request.Author,
                Requester: new Person(spApproval.Requester),
                RequesterOrgSymbol: spApproval.RequesterOrgSymbol,
                RequesterDSNPhone: spApproval.RequesterDSNPhone,
                RequesterCommPhone: spApproval.RequesterCommPhone,
                Approver: new Person(spApproval.Approver),
                ApproverOrgSymbol: spApproval.ApproverOrgSymbol,
                ApproverDSNPhone: spApproval.ApproverDSNPhone,
                ApproverCommPhone: spApproval.ApproverCommPhone,
                NoveltyRequirementType: spApproval.NoveltyRequirementType,
                FundingOrgOrDeputy: spApproval.FundingOrgOrDeputy,
                ApplicationNeeded: spApproval.ApplicationNeeded,
                OtherApplicationNeeded: spApproval.OtherApplicationNeeded,
                IsProjectedOrgsEnterprise: spApproval.IsProjectedOrgsEnterprise,
                ProjectedOrgsImpactedCenter: spApproval.ProjectedOrgsImpactedCenter,
                ProjectedOrgsImpactedOrg: spApproval.ProjectedOrgsImpactedOrg,
                ProjectedImpactedUsers: spApproval.ProjectedImpactedUsers,
                OperationalNeedDate: request.OperationalNeedDate ? moment(spApproval.OperationalNeedDate) : null,
                OrgPriority: spApproval.OrgPriority,
                PriorityExplanation: spApproval.PriorityExplanation,
                BusinessObjective: spApproval.BusinessObjective,
                FunctionalRequirements: spApproval.FunctionalRequirements,
                Benefits: spApproval.Benefits,
                Risk: spApproval.Risk,
                AdditionalInfo: spApproval.AdditionalInfo,
                "odata.etag": request["odata.etag"]
            })
        }
    }

    private submitApprovalToRequestApproval(requestApproval: ISubmitRequestApproval, submittedRequest: IRequirementsRequest): IRequestApproval {
        return {
            Id: requestApproval.Id ? requestApproval.Id : -1,
            Created: moment(requestApproval.Created),
            AuthorId: requestApproval.AuthorId ? requestApproval.AuthorId : -1,
            Request: new RequirementsRequest({
                Id: requestApproval.RequestId,
                Title: requestApproval.RequestTitle,
                Status: submittedRequest.Status,
                StatusDateTime: submittedRequest.StatusDateTime,
                RequestDate: moment(requestApproval.RequestDate),
                Author: submittedRequest.Author,
                Requester: submittedRequest.Requester,
                RequesterOrgSymbol: requestApproval.RequesterOrgSymbol,
                RequesterDSNPhone: requestApproval.RequesterDSNPhone,
                RequesterCommPhone: requestApproval.RequesterCommPhone,
                Approver: submittedRequest.Approver,
                ApproverOrgSymbol: requestApproval.ApproverOrgSymbol,
                ApproverDSNPhone: requestApproval.ApproverDSNPhone,
                ApproverCommPhone: requestApproval.ApproverCommPhone,
                NoveltyRequirementType: requestApproval.NoveltyRequirementType,
                FundingOrgOrDeputy: requestApproval.FundingOrgOrDeputy,
                ApplicationNeeded: requestApproval.ApplicationNeeded,
                OtherApplicationNeeded: requestApproval.OtherApplicationNeeded,
                IsProjectedOrgsEnterprise: requestApproval.IsProjectedOrgsEnterprise,
                ProjectedOrgsImpactedCenter: requestApproval.ProjectedOrgsImpactedCenter,
                ProjectedOrgsImpactedOrg: requestApproval.ProjectedOrgsImpactedOrg,
                ProjectedImpactedUsers: requestApproval.ProjectedImpactedUsers,
                OperationalNeedDate: requestApproval.OperationalNeedDate ? moment(requestApproval.OperationalNeedDate) : null,
                OrgPriority: requestApproval.OrgPriority,
                PriorityExplanation: requestApproval.PriorityExplanation,
                BusinessObjective: requestApproval.BusinessObjective,
                FunctionalRequirements: requestApproval.FunctionalRequirements,
                Benefits: requestApproval.Benefits,
                Risk: requestApproval.Risk,
                AdditionalInfo: requestApproval.AdditionalInfo,
                "odata.etag": submittedRequest["odata.etag"]
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
            Created: moment(),
            AuthorId: 2,
            Request: new RequirementsRequest({
                Id: 1,
                Title: "New Title, Overwriting the Base Title",
                Status: RequestStatuses.APPROVED,
                StatusDateTime: moment(),
                RequestDate: moment(),
                Author: new Person({
                    Id: 1,
                    Title: "Clark, Jeremy M CTR USAF AFMC AFLCMC/OZIC",
                    EMail: "jeremyclark@superemail.com"
                }),
                Requester: new Person({
                    Id: 1,
                    Title: "Clark, Jeremy M CTR USAF AFMC AFLCMC/OZIC",
                    EMail: "jeremyclark@superemail.com"
                }),
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                Approver: new Person({
                    Id: 2,
                    Title: "PORTERFIELD, ROBERT D GS-13 USAF AFMC AFLCMC/OZIC",
                    EMail: "robertporterfield@superemail.com"
                }),
                ApproverOrgSymbol: "OZI",
                ApproverDSNPhone: "1234567890",
                ApproverCommPhone: "1234567890",
                NoveltyRequirementType: NoveltyRequirementTypes.NEW_CAP,
                FundingOrgOrDeputy: "OZI",
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
            Created: moment(),
            AuthorId: 3,
            Request: new RequirementsRequest({
                Id: 2,
                Title: "Shouldn't appear",
                Status: RequestStatuses.APPROVED,
                StatusDateTime: moment(),
                RequestDate: moment(),
                Author: new Person({
                    Id: 2,
                    Title: "PORTERFIELD, ROBERT D GS-13 USAF AFMC AFLCMC/OZIC",
                    EMail: "robertporterfield@superemail.com"
                }),
                Requester: new Person({
                    Id: 2,
                    Title: "PORTERFIELD, ROBERT D GS-13 USAF AFMC AFLCMC/OZIC",
                    EMail: "robertporterfield@superemail.com"
                }),
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                Approver: new Person({
                    Id: 1,
                    Title: "Clark, Jeremy M CTR USAF AFMC AFLCMC/OZIC",
                    EMail: "jeremyclark@superemail.com"
                }),
                ApproverOrgSymbol: "OZI",
                ApproverDSNPhone: "1234567890",
                ApproverCommPhone: "1234567890",
                NoveltyRequirementType: NoveltyRequirementTypes.MOD_EXISTING_CAP,
                FundingOrgOrDeputy: "",
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

    async getRequestApproval(request: IRequirementsRequest): Promise<IRequestApproval | undefined> {
        await this.sleep();
        let approval = this.approvals.find(approval => approval.Request.Id === request.Id && approval.AuthorId === request.Approver.Id);
        if (approval) {
            approval.Request.Status = request.Status;
            approval.Request.StatusDateTime = request.StatusDateTime;
        }
        return approval;
    }

    async getRequestApprovals(requests: IRequirementsRequest[]): Promise<IRequestApproval[]> {
        await this.sleep();
        let filteredApprovals: IRequestApproval[] = [];
        for (let request of requests) {
            let approval = this.approvals.find(a => a.Request.Id === request.Id && a.AuthorId === request.Approver.Id);
            if (approval) {
                filteredApprovals.push({
                    ...approval,
                    Request: {
                        ...approval.Request,
                        Status: request.Status,
                        StatusDateTime: request.StatusDateTime
                    }
                });
            }
        }
        return filteredApprovals;
    }

    async submitApproval(request: IRequirementsRequest): Promise<IRequestApproval> {
        let requestCrud = new RequirementsRequest(request);
        let currentUser = await this.userApi.getCurrentUser();
        if (!requestCrud.isReadOnly(currentUser, await this.userApi.getCurrentUsersRoles())) {
            if (currentUser.Id === request.Approver.Id) {
                let newApproval: IRequestApproval = {
                    Id: ++this.maxId,
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