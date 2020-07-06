import { ISiteUserInfo } from "@pnp/sp/site-users/types";
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
    persona?: {
        text: string,
        imageUrl: string,
        Email: string
    }

    constructor(person: IPerson = { Id: -1, Title: "", EMail: "" }, user?: ISiteUserInfo) {
        this.Id = person.Id;
        this.Title = person.Title;
        this.EMail = person.EMail;
        if (user) {
            this.persona = {
                text: user.Title,
                imageUrl: "/_layouts/15/userphoto.aspx?accountname=" + user.LoginName + "&size=S",
                Email: user.Email
            }
        }
    }


    getPersona = () => {
        return this.persona ? this.persona : {
            text: this.Title,
            imageUrl: "",
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
        }, user)
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