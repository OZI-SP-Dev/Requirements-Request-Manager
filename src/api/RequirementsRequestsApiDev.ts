import moment from "moment";
import { IRequirementsRequest, RequirementTypes, ApplicationTypes, Centers, OrgPriorities, IRequirementsRequestCRUD, RequirementsRequest } from "./DomainObjects";
import { IRequirementsRequestApi } from "./RequirementsRequestsApi";

export default class RequirementsRequestsApiDev implements IRequirementsRequestApi {

    requests: IRequirementsRequestCRUD[] = []

    constructor() {
        this.requests = [
            new RequirementsRequest({
                Id: 1,
                Title: "Test1",
                RequestDate: moment(),
                ReceivedDate: moment(),
                Requester: {
                    Id: "1",
                    Title: "Jeremy Clark",
                    Email: "jeremyclark@superemail.com"
                },
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                ApprovingPEO: {
                    Id: "2",
                    Title: "Robert Porterfield",
                    Email: "robertporterfield@superemail.com"
                },
                PEOApprovedDate: moment(),
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
                Requester: {
                    Id: "2",
                    Title: "Robert Porterfield",
                    Email: "robertporterfield@superemail.com"
                },
                RequesterOrgSymbol: "OZIC",
                RequesterDSNPhone: "1234567890",
                RequesterCommPhone: "1234567890",
                ApprovingPEO: {
                    Id: "1",
                    Title: "Jeremy Clark",
                    Email: "jeremyclark@superemail.com"
                },
                PEOApprovedDate: moment(),
                PEOOrgSymbol: "OZI",
                PEO_DSNPhone: "1234567890",
                PEO_CommPhone: "1234567890",
                RequirementType: RequirementTypes.NEW_CAP,
                FundingOrgOrPEO: "OZI",
                ApplicationNeeded: ApplicationTypes.SHAREPOINT,
                OtherApplicationNeeded: "",
                IsProjectedOrgsEnterprise: false,
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

    async fetchRequirementsRequestById(Id: number): Promise<IRequirementsRequestCRUD | null | undefined> {
        this.sleep();
        return this.requests.find(request => request.Id === Id);
    }

    async fetchRequirementsRequests(): Promise<IRequirementsRequestCRUD[]> {
        this.sleep();
        return this.requests;
    }

    async submitRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<IRequirementsRequestCRUD> {
        this.sleep();
        let newRequest = new RequirementsRequest(requirementsRequest);
        let oldIndex = this.requests.findIndex(request => newRequest.Id === request.Id);
        if (oldIndex > -1) {
            this.requests[oldIndex] = newRequest;
        } else {
            newRequest.Id = ++this.maxId;
            this.requests.push(newRequest);
        }
        return newRequest;
    }

    async deleteRequirementsRequest(requirementsRequest: IRequirementsRequest): Promise<void> {
        this.sleep();
        this.requests.filter(request => request.Id !== requirementsRequest.Id);
        return;
    }

}