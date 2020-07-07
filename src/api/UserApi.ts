import { TestImages } from "@uifabric/example-data";
import { spWebContext } from "../providers/SPWebContext";

export interface IPerson {
    Id: number
    Title: string
    EMail: string
}

export class Person implements IPerson {
    Id: number
    Title: string
    EMail: string
    LoginName?: string

    constructor(person: IPerson = { Id: -1, Title: "", EMail: "" }, LoginName?: string) {
        this.Id = person.Id;
        this.Title = person.Title;
        this.EMail = person.EMail;
        this.LoginName = LoginName;
    }

    getPersona = () => {
        return {
            text: this.Title,
            imageUrl: this.LoginName ? "/_layouts/15/userphoto.aspx?accountname=" + this.LoginName + "&size=S" : TestImages.personaMale,
            Email: this.EMail
        }
    }
}

export interface IUserApi {
    getCurrentUser: () => Promise<Person>
}

export class UserApi implements IUserApi {

    getCurrentUser = async (): Promise<Person> => {
        let user = await spWebContext.currentUser();
        return new Person({
            Id: user.Id,
            Title: user.Title,
            EMail: user.Email
        }, user.LoginName)
    };
}

export class UserApiDev implements IUserApi {

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    getCurrentUser = async (): Promise<Person> => {
        await this.sleep();
        return new Person({
            Id: 1,
            Title: "Default User",
            EMail: "me@example.com"
        })
    };
}

export class UserApiConfig {
    private static userApi: IUserApi

    static getApi(): IUserApi {
        if (!this.userApi) {
            this.userApi = process.env.NODE_ENV === 'development' ? new UserApiDev() : new UserApi();
        }
        return this.userApi;
    }
}