import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { spWebContext } from "../providers/SPWebContext";
import { ApiError, InternalError } from './InternalErrors';
import { IRolesApi, RolesApiConfig, RoleType } from './RolesApi';
import { TestImages } from '@uifabric/example-data';

export interface IPerson extends IPersonaProps {
    Id: number,
    Title: string,
    EMail: string,
}

/**
 * This class represents a User of this application. 
 * It also supports interfacing with the PeoplePicker library.
 */
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
    /**
     * @returns The current, logged in user. It will return a cached version after fetching it the first time.
     */
    getCurrentUser: () => Promise<IPerson>

    /**
     * @returns The current, logged in user's roles. It will return a cached version after fetching it the first time.
     */
    getCurrentUsersRoles: () => Promise<RoleType[]>

    /**
     * Get the Id of the user with the email given
     * 
     * @param email The email of the user
     * 
     * @returns The Id of the user with the supplied email
     */
    getUserId: (email: string) => Promise<number>
}

export class UserApi implements IUserApi {

    private rolesApi: IRolesApi = RolesApiConfig.getApi();

    private currentUser?: IPerson;
    private currentUsersRoles?: RoleType[];

    getCurrentUser = async (): Promise<IPerson> => {
        try {
            if (!this.currentUser) {
                let user = await spWebContext.currentUser();
                this.currentUser = new Person({
                    Id: user.Id,
                    Title: user.Title,
                    EMail: user.Email
                }, user.LoginName)
            }
            return this.currentUser;
        } catch (e) {
            console.error("Error occurred while trying to fetch the current user");
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch the current user: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch the current user: ${e}`));
            } else {
                throw new ApiError(undefined, "Unknown error occurred while trying to fetch the current user");
            }
        }
    };

    getCurrentUsersRoles = async (): Promise<RoleType[]> => {
        try {
            if (!this.currentUsersRoles) {
                let currentUser = await this.getCurrentUser();
                let currentUsersRoles = await this.rolesApi.getRolesForUser(currentUser.Id);
                this.currentUsersRoles = currentUsersRoles ? currentUsersRoles.Roles.map(r => r.Role) : [];
            }
            return this.currentUsersRoles;
        } catch (e) {
            console.error("Error occurred while trying to fetch the current user's roles");
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch the current user's roles: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch the current user's roles: ${e}`));
            } else {
                throw new ApiError(undefined, "Unknown error occurred while trying to fetch the current user's roles");
            }
        }
    }

    getUserId = async (email: string) => {
        try {
            return (await spWebContext.ensureUser(email)).data.Id;
        } catch (e) {
            console.error(`Error occurred while trying to fetch user with Email ${email}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch user with Email ${email}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch user with Email ${email}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch user with Email ${email}`);
            }
        }
    }
}

export class UserApiDev implements IUserApi {

    rolesApi: IRolesApi = RolesApiConfig.getApi();

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    getCurrentUser = async (): Promise<IPerson> => {
        await this.sleep();
        return new Person({
            Id: 1,
            Title: "Default User",
            EMail: "me@example.com",
            imageUrl: TestImages.personaMale
        })
    };

    getCurrentUsersRoles = async (): Promise<RoleType[]> => {
        await this.sleep();
        let currentUser = await this.getCurrentUser();
        let userRoles = await this.rolesApi.getRolesForUser(currentUser.Id);
        return userRoles ? userRoles.Roles.map(r => r.Role) : [];
    }

    getUserId = async () => {
        await this.sleep();
        return 1;
    }
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