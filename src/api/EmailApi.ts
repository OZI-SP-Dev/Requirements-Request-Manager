import { sp } from "@pnp/sp";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { IPerson } from "./UserApi";
import { ApiError } from "./InternalErrors";
import "@pnp/sp/sputilities";

declare var _spPageContextInfo: any;

export interface IEmailApi {
    readonly siteUrl: string,
    sendEmail: (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson) => Promise<void>
};

export class EmailApi implements IEmailApi {

    siteUrl: string = _spPageContextInfo.webAbsoluteUrl;

    constructor() {
        sp.setup({
            sp: {
                baseUrl: _spPageContextInfo.webAbsoluteUrl
            }
        });
    }

    getEmails(people: IPerson[]) {
        return people.filter(p => p && p.EMail).map(p => p.EMail);
    }

    async sendEmail(to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson): Promise<void> {
        try {
            let email: IEmailProperties = {
                To: this.getEmails(to),
                CC: cc ? this.getEmails(cc) : undefined,
                Subject: "Requirement Requests Manager " + subject,
                Body: body.replace(/\n/g, '<BR>'),
                From: from?.EMail,
                AdditionalHeaders: {
                    "content-type": "text/html"
                }
            }
            await sp.utility.sendEmail(email);
        } catch (e) {
            let message = `Error trying to send Email with subject {${subject}}`
            console.error(message);
            console.error(e);
            if (e instanceof Error) {
                message = message += ` with error message ${e.message}`;
                throw new ApiError(e, message);
            } else if (typeof (e) === "string") {
                message += ` with error message ${e}`;
                throw new ApiError(new Error(e), message);
            } else {
                message += ` with error message ${e.message}`;
                throw new ApiError(new Error(message));
            }
        }
    }
}

export class EmailApiDev implements IEmailApi {

    siteUrl: string = "localhost";

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    async sendEmail(): Promise<void> {
        await this.sleep();
        //Empty as there isn't really anything to do for it in dev.
    }
}

export class EmailApiConfig {
    private static emailApi: IEmailApi

    // optionally supply the api used to set up test data in the dev version
    static getApi(): IEmailApi {
        if (!this.emailApi) {
            this.emailApi = process.env.NODE_ENV === 'development' ? new EmailApiDev() : new EmailApi();
        }
        return this.emailApi;
    }
}