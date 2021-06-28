import moment from "moment";
import { ApplicationTypes, Centers, IRequirementsRequest, IRequirementsRequestCRUD, NoveltyRequirementTypes, OrgPriorities, RequestStatuses, RequirementsRequest } from "./DomainObjects";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "./RequestApprovalsApi";
import { FilterField, IRequirementsRequestApi, RequestFilter } from "./RequirementsRequestsApi";
import { Person, UserApiConfig } from "./UserApi";

export default class RequirementsRequestsApiDev implements IRequirementsRequestApi {

    requests: IRequirementsRequestCRUD[] = [];
    approvalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi(this);
    userApi = UserApiConfig.getApi();

    constructor() {
        this.requests = [
            new RequirementsRequest({
                Id: 1,
                Title: "Test1",
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
            }, this),
            new RequirementsRequest({
                Id: 2,
                Title: "Test2",
                Status: RequestStatuses.SUBMITTED,
                StatusDateTime: moment(),
                RequestDate: moment(),
                Author: new Person({
                    Id: 1,
                    Title: "Clark, Jeremy M CTR USAF AFMC AFLCMC/OZIC",
                    EMail: "jeremyclark@superemail.com"
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
            }, this)
        ]
    }

    maxId: number = 2;

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    async fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | undefined> {
        await this.sleep();
        let request = this.requests.find(request => request.Id === Id && request.Status !== RequestStatuses.CANCELLED && request.Status !== RequestStatuses.CLOSED);
        if (request) {
            let approval = await this.approvalsApi.getRequestApproval(request);
            request = new RequirementsRequest(approval ? approval.Request : request);
        }
        return request;
    }

    async fetchRequirementsRequests(filters: RequestFilter[], sortBy?: FilterField, ascending?: boolean, userId?: number): Promise<IRequirementsRequestCRUD[]> {
        await this.sleep();
        let approvals = await this.approvalsApi.getRequestApprovals(this.requests);
        let requests = this.requests
            .filter(request => request.Status !== RequestStatuses.CANCELLED && request.Status !== RequestStatuses.CLOSED)
            .map(req => {
                let approval = approvals.find(app => app.Request.Id === req.Id && app.AuthorId === req.Approver.Id);
                return new RequirementsRequest(approval ? approval.Request : req);
            });
        if (userId !== undefined) {
            requests = requests.filter(request => request.Requester.Id === userId);
        }
        return requests;
    }

    async submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        await this.sleep();
        if (!(new RequirementsRequest(requirementsRequest)).isReadOnly(await this.userApi.getCurrentUser(), await this.userApi.getCurrentUsersRoles())) {
            let newRequest = new RequirementsRequest(requirementsRequest);
            let oldIndex = this.requests.findIndex(request => newRequest.Id === request.Id);
            if (oldIndex > -1) {
                this.requests[oldIndex] = newRequest;
            } else {
                newRequest.Id = ++this.maxId;
                this.requests.push(newRequest);
            }
            return newRequest;
        } else {
            throw new Error("You do not have permission update this Request!");
        }
    }

    async updateRequestStatus(requirementsRequest: IRequirementsRequest, status: RequestStatuses): Promise<IRequirementsRequestCRUD> {
        await this.sleep();
        let updatedRequest = new RequirementsRequest(requirementsRequest);
        updatedRequest.Status = status;
        updatedRequest.StatusDateTime = moment();
        this.requests[this.requests.findIndex(r => r.Id === updatedRequest.Id)] = updatedRequest;
        return updatedRequest;
    }

}