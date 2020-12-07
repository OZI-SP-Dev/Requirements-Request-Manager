import { useState } from "react";
import { ApplicationTypes, IRequirementsRequestCRUD } from "../api/DomainObjects";
import { EmailApiConfig } from "../api/EmailApi";
import { InternalError } from "../api/InternalErrors";
import { INote } from "../api/NotesApi";
import { RoleType } from "../api/RolesApi";
import { IPerson, IUserApi, UserApiConfig } from "../api/UserApi";
import { useRoles } from "./useRoles";

export interface IEmailSender {
    sending: boolean,
    error: string,
    clearError: () => void,
    sendEmail: (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson) => Promise<void>,
    sendSubmitEmail: (request: IRequirementsRequestCRUD) => Promise<void>,
    sendApprovalEmail: (request: IRequirementsRequestCRUD, comment?: string) => Promise<void>,
    sendDisapprovalEmail: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    sendAcceptedEmail: (request: IRequirementsRequestCRUD, comment?: string) => Promise<void>,
    sendDeclinedEmail: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    sendReviewEmail: (request: IRequirementsRequestCRUD, comment?: string) => Promise<void>,
    sendContractEmail: (request: IRequirementsRequestCRUD, comment?: string) => Promise<void>,
    sendClosedEmail: (request: IRequirementsRequestCRUD, comment?: string) => Promise<void>,
    sendCancelledEmail: (request: IRequirementsRequestCRUD, comment: string) => Promise<void>,
    sendNoteEmail: (request: IRequirementsRequestCRUD, note: INote) => Promise<void>
}

export function useEmail(): IEmailSender {

    const [sending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const roles = useRoles();

    const emailApi = EmailApiConfig.getApi();
    const userApi: IUserApi = UserApiConfig.getApi();

    const clearError = () => setError("");

    const getManagers = (): IPerson[] => {
        return roles.roles
            .filter(role => role.Roles
                .some(r => r.Role === RoleType.MANAGER))
            .map(role => role.User);
    }

    const sendEmail = async (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson): Promise<void> => {
        try {
            setSending(true);
            if (to.length) {
                await emailApi.sendEmail(to, subject, body, cc, from);
            }
        } catch (e) {
            let message = `Error trying to send Email to ${to} with subject ${subject} and body ${body}`;
            console.error(message);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                message = message += ` with error message ${e.message}`;
                setError(message);
                throw new InternalError(e, message);
            } else if (typeof (e) === "string") {
                message += ` with error message ${e}`;
                setError(message);
                throw new InternalError(new Error(e), message);
            } else {
                message += ` with error message ${e.message}`;
                setError(message);
                throw new InternalError(new Error(message));
            }
        } finally {
            setSending(false);
        }
    }

    const sendSubmitEmail = async (request: IRequirementsRequestCRUD): Promise<void> => {
        let to = [request.Approver];
        let subject = `Request ${request.getFormattedId()} Submitted`;
        let body = `Hello, a Requirement Request, ${request.Title}, has been submitted for which you are the approving official by ${request.Requester.Title}.
            
            To review/approve the request, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/Review/${request.Id}`;
        let cc = getManagers();

        return sendEmail(to, subject, body, cc);
    }

    const sendApprovalEmail = async (request: IRequirementsRequestCRUD, comment?: string): Promise<void> => {
        let to = getManagers();
        if (request.Approver.Id !== request.Requester.Id) {
            to.push(request.Requester);
        }
        let subject = `Request ${request.getFormattedId()} Approved`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been approved by the approving official ${request.Approver.Title}.
        ${comment ? `The approver left a comment saying "${comment}"` : ''}
        
        To view the request and any comments/modifications left by the approver, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendDisapprovalEmail = async (request: IRequirementsRequestCRUD, comment: string): Promise<void> => {
        let to = [request.Requester, request.Author];
        let subject = `Request ${request.getFormattedId()} Disapproved`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been disapproved by the approving official ${request.Approver.Title}. Please review the comment left by the approver for action on your part as the requester ${request.Requester.Title}.
        The approver left a comment saying "${comment}"
        
        To view the request and any comments/modifications left by the approver, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendAcceptedEmail = async (request: IRequirementsRequestCRUD, comment?: string): Promise<void> => {
        let to = [request.Requester, request.Approver, request.Author];
        let subject = `Request ${request.getFormattedId()} Accepted by Manager`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been approved/accepted by the Requirements Manager ${(await userApi.getCurrentUser()).Title}. The next step for the Request is for it to be taken to the Review Boards for review. 
        ${comment ? `The Manager left a comment saying "${comment}"` : ''}
        
        To view the request and any comments/modifications left by the manager, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendDeclinedEmail = async (request: IRequirementsRequestCRUD, comment: string): Promise<void> => {
        let to = [request.Requester, request.Approver, request.Author];
        let subject = `Request ${request.getFormattedId()} Declined by Manager`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been declined by the Requirements Manager ${(await userApi.getCurrentUser()).Title} Please review the comment left by the approver for action on your part as the requester ${request.Requester.Title} before it can be accepted.
        The Manager left a comment saying "${comment}
        
        To view the request and any comments/modifications left by the manager, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendReviewEmail = async (request: IRequirementsRequestCRUD, comment?: string): Promise<void> => {
        let to = [request.Requester, request.Approver, request.Author];
        let subject = `Request ${request.getFormattedId()} Under Board Review`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has started being reviewed by the board officials. If all Boards approve the Request, the Requirement will be prioritized for available funding. When funds are available, it will be put on a contract for development. You will be notified once your Requirement goes on contract.
        ${comment ? `The Requirements Manager left a comment saying "${comment}"` : ''}
        
        To view the request and any comments/modifications left by the manager, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendContractEmail = async (request: IRequirementsRequestCRUD, comment?: string): Promise<void> => {
        let to = [request.Requester, request.Approver, request.Author];
        let subject = `Request ${request.getFormattedId()} On Contract`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been put on contract and development for the Requirement will begin soon.
        ${comment ? `The Requirements Manager left a comment saying "${comment}"` : ''}
        
        To view the request and any comments/modifications left by the manager, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/View/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    const sendClosedEmail = async (request: IRequirementsRequestCRUD, comment?: string): Promise<void> => {
        let to = [request.Requester, request.Approver, request.Author];
        let subject = `Request ${request.getFormattedId()} Closed`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been marked as Completed and has been Closed by the Requirements Manager ${(await userApi.getCurrentUser()).Title}.
        ${comment ? `The Requirements Manager left a comment saying "${comment}"` : ''}`;

        return sendEmail(to, subject, body);
    }

    const sendCancelledEmail = async (request: IRequirementsRequestCRUD, comment: string): Promise<void> => {
        let currentUser = (await userApi.getCurrentUser()).Title;
        let to = getManagers();
        to.push(request.Requester);
        to.push(request.Approver);
        to.push(request.Author);
        let subject = `Request ${request.getFormattedId()} Cancelled`;
        let body = `Hello, Requirement Request ${request.getFormattedId()}, ${request.Title}, for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been cancelled by ${currentUser}.
        ${currentUser} left a comment saying ${comment}`;

        return sendEmail(to, subject, body);
    }

    const sendNoteEmail = async (request: IRequirementsRequestCRUD, note: INote): Promise<void> => {
        let to = [request.Approver, request.Requester];
        let subject = `Note Added for Request ${request.getFormattedId()}`;
        let body = `Hello, a note has been added to your Requirement Request ${request.Title}

            The note is:
            <h4>${note.Title}</h4><p>"${note.Text}"</p>
            
            To review the request/note, please copy the following link and paste it in your browser ${emailApi.siteUrl}/app/index.aspx#/Requests/Review/${request.Id}`;

        return sendEmail(to, subject, body);
    }

    return {
        sending,
        error,
        clearError,
        sendEmail,
        sendSubmitEmail,
        sendApprovalEmail,
        sendDisapprovalEmail,
        sendAcceptedEmail,
        sendDeclinedEmail,
        sendReviewEmail,
        sendContractEmail,
        sendClosedEmail,
        sendCancelledEmail,
        sendNoteEmail
    }
}