import { IUserRoles, RoleType, IRole, RolesApiConfig } from "../api/RolesApi";
import { useState, useEffect } from "react";
import { InternalError } from "../api/InternalErrors";
import { IPerson } from "../api/UserApi";

export interface IRoles {
    loading: boolean,
    error: string,
    clearError: () => void,
    roles: IUserRoles[],
    submitRole: (user: IPerson, role: RoleType) => Promise<void>,
    deleteRole: (role: IRole) => Promise<void>
}

export function useRoles(): IRoles {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [roles, setRoles] = useState<IUserRoles[]>([]);

    const rolesApi = RolesApiConfig.getApi();

    const clearError = () => setError("");

    const fetchRoles = async () => {
        try {
            setLoading(true);
            setRoles(await rolesApi.getAllRoles());
        } catch (e) {
            console.error("Error trying to fetch all Roles");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError("Unknown error occurred while trying to fetch all Roles!");
                throw new InternalError(new Error("Unknown error occurred while trying to fetch all Roles!"));
            }
        } finally {
            setLoading(false);
        }
    }

    const submitRole = async (user: IPerson, role: RoleType) => {
        try {
            setLoading(true);
            let newRole = await rolesApi.submitRole(user, role);
            let allRoles = roles;
            let i = allRoles.findIndex(r => r.User.Id === user.Id);
            if (i >= 0) {
                allRoles[i] = newRole;
            } else {
                allRoles.push(newRole);
            }
            setRoles(allRoles);
        } catch (e) {
            console.error(`Error trying to add Role ${role} for User ${user.Title}`);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message + " Please copy your work so far and refresh the page to try again!");
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e + " Please copy your work so far and refresh the page to try again!");
                throw new InternalError(new Error(e));
            } else {
                setError(`Unknown error occurred while trying to add Role ${role} for User ${user.Title}, please copy your work so far and refresh the page to try again!`);
                throw new InternalError(new Error(`Unknown error occurred while trying to add Role ${role} for User ${user.Title}, please copy your work so far and refresh the page to try again!`));
            }
        } finally {
            setLoading(false);
        }
    }

    const deleteRole = async (role: IRole) => {
        try {
            setLoading(true);
            await rolesApi.deleteRole(role.Id);
        } catch (e) {
            console.error("Error trying to delete Role");
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                setError(e.message);
                throw new InternalError(e);
            } else if (typeof (e) === "string") {
                setError(e);
                throw new InternalError(new Error(e));
            } else {
                setError("Unknown error occurred while trying to delete Role!");
                throw new InternalError(new Error("Unknown error occurred while trying to delete Role!"));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRoles(); // eslint-disable-next-line
    }, []);

    return ({
        loading,
        error,
        clearError,
        roles,
        submitRole,
        deleteRole
    })

}