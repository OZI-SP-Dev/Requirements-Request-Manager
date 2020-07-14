import moment, { Moment } from "moment";
import { spWebContext } from "../providers/SPWebContext";
import { IUserApi, UserApiConfig } from "./UserApi";


export interface IRequestApproval {
    Id: number,
    RequestId: number,
    Comment: string,
    Created: Moment,
    AuthorId: number
}

interface SPRequestApproval {
    Id: number,
    RequestId: number,
    Title: string,
    // this is a date-time in ISO format
    Created: string,
    AuthorId: number
}

interface ISubmitRequestApproval {
    Title: string,
    RequestId: number
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
    getRequestApprovals(requestIds: number[]): Promise<IRequestApproval[]>

    /**
     * Submit an approval for a Request
     * 
     * @param requestId The Id of the request being approved
     * @param comment An optional one line comment for the request's approval
     * 
     * @returns An IRequestApproval of the new approval submitted
     */
    submitApproval(requestId: number, comment: string): Promise<IRequestApproval>;
}

export class RequestApprovalsApi implements IRequestApprovalsApi {

    requestApprovalsList = spWebContext.lists.getByTitle("RequestApprovals");

    async getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined> {
        let requestApproval: SPRequestApproval = (await this.requestApprovalsList.items.select("Id", "RequestId", "Title", "Created", "AuthorId").filter(`RequestId eq ${requestId} and AuthorId eq ${approverId}`).get())[0];
        return requestApproval ? {
            Id: requestApproval.Id,
            RequestId: requestApproval.RequestId,
            Comment: requestApproval.Title,
            Created: moment(requestApproval.Created),
            AuthorId: requestApproval.AuthorId
        } : undefined;
    }

    async getRequestApprovals(requestIds: number[]): Promise<IRequestApproval[]> {
        let pages = await this.requestApprovalsList.items.select("Id", "RequestId", "Title", "Created", "AuthorId").getPaged();
        let approvals: SPRequestApproval[] = pages.results;
        while (pages.hasNext) {
            approvals = approvals.concat((await pages.getNext()).results);
        }
        return approvals
            .filter(approval => requestIds.includes(approval.RequestId))
            .map(approval => {
                return {
                    Id: approval.Id,
                    RequestId: approval.RequestId,
                    Comment: approval.Title,
                    Created: moment(approval.Created),
                    AuthorId: approval.AuthorId
                }
            })
    }

    async submitApproval(requestId: number, comment: string): Promise<IRequestApproval> {
        let submitApproval: ISubmitRequestApproval = {
            Title: comment,
            RequestId: requestId
        }
        let requestApproval: SPRequestApproval = (await this.requestApprovalsList.items.add(submitApproval)).data;
        return {
            Id: requestApproval.Id,
            RequestId: requestApproval.RequestId,
            Comment: requestApproval.Title,
            Created: moment(requestApproval.Created),
            AuthorId: requestApproval.AuthorId
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
    }];

    maxId = 1;

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    async getRequestApproval(requestId: number, approverId: number): Promise<IRequestApproval | undefined> {
        await this.sleep();
        return this.approvals.find(approval => approval.RequestId === requestId && approval.AuthorId === approverId);
    }

    async getRequestApprovals(requestIds: number[]): Promise<IRequestApproval[]> {
        await this.sleep();
        return this.approvals.filter(approval => requestIds.includes(approval.RequestId));
    }

    async submitApproval(requestId: number, comment: string): Promise<IRequestApproval> {
        let newApproval: IRequestApproval = {
            Id: ++this.maxId,
            RequestId: requestId,
            Comment: comment,
            Created: moment(),
            AuthorId: (await this.userApi.getCurrentUser()).Id
        }
        this.approvals.push(newApproval);
        return newApproval;
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