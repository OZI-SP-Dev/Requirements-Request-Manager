import React, { createContext, FunctionComponent, useEffect, useState } from "react";
import { RoleType } from "../api/RolesApi";
import { IPerson, UserApiConfig } from "../api/UserApi";


export interface IUserContext {
    user: IPerson | undefined,
    roles: RoleType[],
    loadingUser: boolean
}

export const UserContext = createContext<Partial<IUserContext>>({ user: undefined, loadingUser: true });

export const UserProvider: FunctionComponent = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IPerson>();
    const [roles, setRoles] = useState<RoleType[]>([]);

    const userApi = UserApiConfig.getApi();

    const fetchUser = async () => {
        const user = await userApi.getCurrentUser();
        if (user) {
            setUser(user);
            let userRoles = await userApi.getCurrentUsersRoles();
            if (userRoles) {
                setRoles(userRoles);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUser(); // eslint-disable-next-line
    }, []);

    const userContext: IUserContext = {
        user,
        roles,
        loadingUser: loading
    }

    return (
        <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
    )
};

export const { Consumer } = UserContext