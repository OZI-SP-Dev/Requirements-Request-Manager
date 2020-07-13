import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { spWebContext } from "../providers/SPWebContext";

export interface IPerson extends IPersonaProps {
    Id: number
    Title: string
    EMail: string
}

export class Person implements IPerson {
    Id: number
    Title: string
    text: string
    secondaryText: string
    EMail: string
    imageUrl?: string
    imageInitials?: string

    constructor(person: IPerson = { Id: -1, Title: "", EMail: "" }, LoginName?: string) {
        this.Id = person.Id;
        this.Title = person.Title ? person.Title : person.text ? person.text : "";
        this.text = person.text ? person.text : this.Title;
        this.secondaryText = person.secondaryText ? person.secondaryText : "";
        this.EMail = person.EMail;
        if (person.imageUrl) {
            this.imageUrl = person.imageUrl;
        } else if (LoginName) {
            this.imageUrl = "/_layouts/15/userphoto.aspx?accountname=" + LoginName + "&size=S"
        }
        if (!this.imageUrl) {
            this.imageInitials = this.Title.substr(this.Title.indexOf(' ') + 1, 1) + this.Title.substr(0, 1);
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