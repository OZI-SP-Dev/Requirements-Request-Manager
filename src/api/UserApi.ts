import { spWebContext } from "../providers/SPWebContext";
import { TestImages } from "@uifabric/example-data";

export interface IUser {
    Id: string | number,
    Title: string,
    Email: string,
    Persona: {
        text: string,
        imageUrl: string,
        Email: string
    }
}

export interface IUserApi {
    getCurrentUser: () => Promise<IUser>
}

export class UserApi implements IUserApi {

    getCurrentUser = async (): Promise<IUser> => {
        let user = await spWebContext.currentUser();
        return {
            Id: user.Id,
            Title: user.Title,
            Email: user.Email,
            Persona: {
                text: user.Title,
                imageUrl: "/_layouts/15/userphoto.aspx?accountname=" + user.LoginName + "&size=S",
                Email: user.Email
            }
        }
    };
}

export class UserApiDev implements IUserApi {

    sleep() {
        return new Promise(r => setTimeout(r, 1500));
    }

    getCurrentUser = async (): Promise<IUser> => {
        await this.sleep();
        return {
            Id: "1",
            Title: "Default User",
            Email: "me@example.com",
            Persona: {
                text: "Default User",
                imageUrl: TestImages.personaMale,
                Email: "me@example.com"
            }
        }
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