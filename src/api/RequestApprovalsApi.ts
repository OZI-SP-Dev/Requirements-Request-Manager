import moment, { Moment } from "moment";
import { spWebContext } from "../providers/SPWebContext";
import { IUserApi, UserApiConfig } from "./UserApi";
import { IRequirementsRequest, RequirementsRequest } from "./DomainObjects";


export interface IRequestApproval {
    Id: number,
    RequestId: number,
    Comment: string,
    Created: Moment,
    AuthorId: number
}

interface SPRequestApproval {
    Id: number,
    // This field is used by SP for the GET endpoints and is expanded as it is a lookup field
    Request: { Id: number },
    Title: string,
    // this is a date-time in ISO format
    Created: string,
    AuthorId: number
}

interface ISubmitRequestApproval {
    Id?: number,
    Title: string,
    RequestId: number,
    Created?: string,
    AuthorId?: number
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
        let requestApproval: SPRequestApproval = (await this.requestApprovalsList.items.select("Id", "Request/Id", "Title", "Created", "AuthorId").filter(`RequestId eq ${requestId} and AuthorId eq ${approverId}`).expand("Request").get())[0];
        return requestApproval ? {
            Id: requestApproval.Id,
            RequestId: requestApproval.Request.Id,
            Comment: requestApproval.Title,
            Created: moment(requestApproval.Created),
            AuthorId: requestApproval.AuthorId
        } : undefined;
    }

    async getRequestApprovals(requests: { requestId: number, approverId: number }[]): Promise<IRequestApproval[]> {
        let pages = await this.requestApprovalsList.items.select("Id", "Request/Id", "Title", "Created", "AuthorId").expand("Request").getPaged();
        let approvals: SPRequestApproval[] = pages.results;
        while (pages.hasNext) {
            approvals = approvals.concat((await pages.getNext()).results);
        }
        return approvals
            .filter(approval =>
                requests.findIndex(request => request.requestId === approval.Request.Id && request.approverId === approval.AuthorId) > -1)
            .map(approval => {
                return {
                    Id: approval.Id,
                    RequestId: approval.Request.Id,
                    Comment: approval.Title,
                    Created: moment(approval.Created),
                    AuthorId: approval.AuthorId
                }
            })
    }

    async submitApproval(request: IRequirementsRequest, comment: string): Promise<IRequestApproval> {
        let requestCrud = new RequirementsRequest(request);
        if (!requestCrud.isReadOnly()) {
            if ((await this.userApi.getCurrentUser()).Id === request.ApprovingPEO.Id) {
                let submitApproval: ISubmitRequestApproval = {
                    Title: comment,
                    RequestId: request.Id
                }
                let requestApproval: ISubmitRequestApproval = (await this.requestApprovalsList.items.add(submitApproval)).data;
                return {
                    Id: requestApproval.Id ? requestApproval.Id : -1,
                    RequestId: requestApproval.RequestId,
                    Comment: requestApproval.Title,
                    Created: moment(requestApproval.Created),
                    AuthorId: requestApproval.AuthorId ? requestApproval.AuthorId : -1
                }
            } else {
                throw new Error("You cannot approve a Request for which you are not the approver!");
            }
        } else {
            throw new Error("You cannot approve a Request that has already been approved!");
        }
    }
}

export class RequestApprovalsApiDev implements IRequestApprovalsApi {

    userApi: IUserApi = UserApiConfig.getApi();

    approvals: IRequestApproval[] = [{
        Id: 1,
        RequestId: 1,
        Comment: "Super approval",
        Created: moment(),
        AuthorId: 2
    }, {
        Id: 2,
        RequestId: 2,
        Comment: "bad approval",
        Created: moment(),
        AuthorId: 3
    }];

    maxId = 2;

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    async getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined> {
        await this.sleep();
        return this.approvals.find(approval => approval.RequestId === requestId && approval.AuthorId === approverId);
    }

    async getRequestApprovals(requests: { requestId: number, approverId: number }[]): Promise<IRequestApproval[]> {
        await this.sleep();
        return this.approvals.filter(approval =>
            requests.findIndex(request => request.requestId === approval.RequestId && request.approverId === approval.AuthorId) > -1);
    }

    async submitApproval(request: IRequirementsRequest, comment: string): Promise<IRequestApproval> {
        let requestCrud = new RequirementsRequest(request);
        if (!requestCrud.isReadOnly()) {
            if ((await this.userApi.getCurrentUser()).Id === request.ApprovingPEO.Id) {
                let newApproval: IRequestApproval = {
                    Id: ++this.maxId,
                    RequestId: request.Id,
                    Comment: comment,
                    Created: moment(),
                    AuthorId: (await this.userApi.getCurrentUser()).Id
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

    static getApi(): IRequestApprovalsApi {
        if (!this.requestApprovalsApi) {
            this.requestApprovalsApi = process.env.NODE_ENV === 'development' ? new RequestApprovalsApiDev() : new RequestApprovalsApi();
        }
        return this.requestApprovalsApi;
    }
}