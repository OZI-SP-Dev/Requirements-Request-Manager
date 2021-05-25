import { spWebContext } from "../providers/SPWebContext";
import { ApiError, InternalError } from "./InternalErrors";
import { IPerson } from "./UserApi";

export enum RoleType {
    ADMIN = "Admin",
    MANAGER = "Manager",
    CIO = "CIO"
}

export interface IRole {
    Id: number,
    Role: RoleType
}

export interface IUserRoles {
    User: IPerson,
    Roles: IRole[]
}

interface SPRole {
    Id: number,
    User: IPerson,
    Title: RoleType
}

interface ISubmitRole {
    Id?: number,
    UserId: number,
    Title: RoleType
}

export interface IRolesApi {
    /**
     * Get the Roles of a given user.
     * 
     * @param userId The Id of the user whose roles are being requested
     * @returns The Roles for a given User in the form of IUserRoles, 
     *          may be undefined if the User does not have any roles.
     */
    getRolesForUser(userId: number): Promise<IUserRoles | undefined>,

    /**
     * Get all roles for all users.
     */
    getAllRoles(): Promise<IUserRoles[]>,

    /**
     * Attach a Role to the given User, and return their complete set of Roles with the new Role added in.
     * 
     * @param user The User for which the Role is being added. The Id needs to be set.
     * @param role The Role being created.
     */
    submitRole(user: IPerson, role: RoleType): Promise<IUserRoles>,

    /**
     * Delete a Role, which will remove the given permissions of that Role to the User it was associated with.
     * 
     * @param roleId The Id of the Role to be deleted.
     */
    deleteRole(roleId: number): Promise<void>
}

export class RolesApi implements IRolesApi {

    rolesList = spWebContext.lists.getByTitle("Roles");

    async getRolesForUser(userId: number): Promise<IUserRoles | undefined> {
        try {
            return this.getIUserRoles(
                await this.rolesList.items
                    .select("Id", "User/Id", "User/Title", "User/EMail", "Title")
                    .expand("User")
                    .filter(`User/Id eq ${userId}`).get())
                .find(role => role.User.Id === userId);
        } catch (e) {
            console.error(`Error occurred while trying to fetch Roles for User with ID ${userId}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch Roles for User with ID ${userId}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch Roles for User with ID ${userId}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to fetch Roles for User with ID ${userId}`);
            }
        }
    }

    async getAllRoles(): Promise<IUserRoles[]> {
        try {
            return this.getIUserRoles(
                await this.rolesList.items
                    .select("Id", "User/Id", "User/Title", "User/EMail", "Title")
                    .expand("User").get());
        } catch (e) {
            console.error("Error occurred while trying to fetch all Roles");
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to fetch all Roles: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to fetch all Roles: ${e}`));
            } else {
                throw new ApiError(undefined, "Unknown error occurred while trying to fetch all Roles");
            }
        }
    }

    async submitRole(user: IPerson, role: RoleType): Promise<IUserRoles> {
        try {
            // fetch roles to check if it is a duplicate and to be able to return the complete set of roles of the user
            let userRoles = await this.getRolesForUser(user.Id);
            if (!userRoles || !userRoles.Roles.some(r => r.Role === role)) {
                let submitRole: ISubmitRole = {
                    UserId: user.Id,
                    Title: role
                }
                let returnedRole: ISubmitRole = (await this.rolesList.items.add(submitRole)).data;
                // if the user already had roles then use those as the base, if not then create a new UserRoles object
                let newRoles: IUserRoles = userRoles ? userRoles : { User: user, Roles: [] }
                newRoles.Roles.push({ Id: returnedRole.Id ? returnedRole.Id : -1, Role: returnedRole.Title });
                return newRoles;
            } else {
                throw new ApiError(new Error(`User ${user.Title} already has the Role ${role}, you cannot submit a duplicate role!`))
            }
        } catch (e) {
            console.error(`Error occurred while trying to add ${role} Role for User ${user.Title}`);
            console.error(e);
            if (e instanceof InternalError) {
                throw e;
            } else if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to add ${role} Role for User ${user.Title}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to add ${role} Role for User ${user.Title}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to add ${role} Role for User ${user.Title}`);
            }
        }
    }

    deleteRole(roleId: number): Promise<void> {
        try {
            return this.rolesList.items.getById(roleId).delete();
        } catch (e) {
            console.error(`Error occurred while trying to delete Role with ID ${roleId}`);
            console.error(e);
            if (e instanceof Error) {
                throw new ApiError(e, `Error occurred while trying to delete Role with ID ${roleId}: ${e.message}`);
            } else if (typeof (e) === "string") {
                throw new ApiError(new Error(`Error occurred while trying to delete Role with ID ${roleId}: ${e}`));
            } else {
                throw new ApiError(undefined, `Unknown error occurred while trying to delete Role with ID ${roleId}`);
            }
        }
    }

    private getIUserRoles(roles: SPRole[]): IUserRoles[] {
        let userRoles: IUserRoles[] = [];
        for (let role of roles) {
            if (Object.values(RoleType).includes(role.Title)) {
                let i = userRoles.findIndex(userRole => userRole.User.Id === role.User.Id);
                if (i > -1) {
                    userRoles[i].Roles.push({ Id: role.Id, Role: role.Title });
                } else {
                    userRoles.push({
                        User: role.User,
                        Roles: [{
                            Id: role.Id,
                            Role: role.Title
                        }]
                    })
                }
            }
        }
        return userRoles;
    }

}

export class RolesApiDev implements IRolesApi {

    sleep() {
        return new Promise(r => setTimeout(r, 500));
    }

    roles: IUserRoles[] = [{
        User: {
            Id: 1,
            Title: "Clark, Jeremy M CTR USAF AFMC AFLCMC/OZIC",
            EMail: "me@example.com"
        },
        Roles: [{
            Id: 1,
            Role: RoleType.ADMIN
        }, {
            Id: 2,
            Role: RoleType.MANAGER
        }]
    }, {
        User: {
            Id: 2,
            Title: "PORTERFIELD, ROBERT D GS-13 USAF AFMC AFLCMC/OZIC",
            EMail: "me@example.com"
        },
        Roles: [{
            Id: 3,
            Role: RoleType.MANAGER
        }]
    }]

    maxId: number = 3;

    async getRolesForUser(userId: number): Promise<IUserRoles | undefined> {
        await this.sleep();
        return this.roles.find(r => r.User.Id === userId);
    }
    async getAllRoles(): Promise<IUserRoles[]> {
        await this.sleep();
        return this.roles;
    }
    async submitRole(user: IPerson, role: RoleType): Promise<IUserRoles> {
        await this.sleep();
        let userRoles = this.roles.find(r => r.User.Id === user.Id);
        if (!userRoles || !userRoles.Roles.some(r => r.Role === role)) {
            if (userRoles) {
                userRoles.Roles.push({ Id: ++this.maxId, Role: role })
            } else {
                userRoles = {
                    User: user,
                    Roles: [{ Id: ++this.maxId, Role: role }]
                }
                this.roles.push(userRoles);
            }
            return userRoles;
        } else {
            throw new ApiError(new Error(`User ${user.Title} already has the Role ${role}, you cannot submit a duplicate role!`))
        }
    }
    async deleteRole(roleId: number): Promise<void> {
        await this.sleep();
        this.roles.filter(ur => !ur.Roles.some(r => r.Id === roleId));
    }

}

export class RolesApiConfig {
    private static rolesApi: IRolesApi

    // optionally supply the api used to set up test data in the dev version
    static getApi(): IRolesApi {
        if (!this.rolesApi) {
            this.rolesApi = process.env.NODE_ENV === 'development' ? new RolesApiDev() : new RolesApi();
        }
        return this.rolesApi;
    }
}