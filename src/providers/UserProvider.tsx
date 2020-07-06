import { Person, UserApiConfig } from "../api/UserApi";
import React, { createContext, FunctionComponent, useState, useEffect } from "react";


export interface IUserContext {
    user: Person | undefined,
    loading: boolean
}

export const UserContext = createContext<Partial<IUserContext>>({ user: undefined, loading: true });

export const UserProvider: FunctionComponent = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Person>();

    const userApi = UserApiConfig.getApi();

    const fetchUser = async () => {
        const user = await userApi.getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUser(); // eslint-disable-next-line
    }, []);

    const userContext: IUserContext = {
        user,
        loading
    }

    return (
        <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
    )
};

export const { Consumer } = UserContext