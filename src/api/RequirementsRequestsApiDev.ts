import moment from "moment";
import { IRequirementsRequest, RequirementTypes, ApplicationTypes, Centers, OrgPriorities, IRequirementsRequestCRUD, RequirementsRequest } from "./DomainObjects";
import { IRequirementsRequestApi } from "./RequirementsRequestsApi";
import { Person } from "./UserApi";
import { IRequestApprovalsApi, RequestApprovalsApiConfig } from "./RequestApprovalsApi";

export default class RequirementsRequestsApiDev implements IRequirementsRequestApi {

    requests: IRequirementsRequestCRUD[] = [];
    approvalsApi: IRequestApprovalsApi = RequestApprovalsApiConfig.getApi();

    constructor() {
        this.requests = [
            new RequirementsRequest({
                Id: 1,
                Title: "Test1",
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
                PEOApprovedDateTime: null,
                PEOApprovedComment: null,
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
            }, this),
            new RequirementsRequest({
                Id: 2,
                Title: "Test2",
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
            }, this)
        ]
    }

    maxId: number = 2;

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    async fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | undefined> {
        await this.sleep();
        let request = this.requests.find(request => request.Id === Id);
        if (request) {
            let approval = await this.approvalsApi.getRequestApproval(request.Id, request.ApprovingPEO.Id);
            request.PEOApprovedDateTime = approval ? approval.Created : null;
            request.PEOApprovedComment = approval ? approval.Comment : null;
        }
        return request;
    }

    async fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]> {
        await this.sleep();
        let approvals = await this.approvalsApi.getRequestApprovals(this.requests.map(req => {
            return { requestId: req.Id, approverId: req.ApprovingPEO.Id }
        }));
        return this.requests.map(req => {
            let approval = approvals.find(app => app.RequestId === req.Id && app.AuthorId === req.ApprovingPEO.Id);
            let request = new RequirementsRequest(req);
            request.PEOApprovedDateTime = approval ? approval.Created : null;
            request.PEOApprovedComment = approval ? approval.Comment : null;
            return request;
        });
    }

    async submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        await this.sleep();
        if (!(new RequirementsRequest(requirementsRequest)).isReadOnly()) {
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

    async deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void> {
        await this.sleep();
        this.requests.filter(request => request.Id !== requirementsRequest.Id);
        return;
    }

}