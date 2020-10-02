import { useHistory } from "react-router-dom";

interface Redirect {
    /**
     * Replaces the current route with the given route. 
     * This is to be used when you do not want the current route to be in the history
     * 
     * @param route the route to redirect to
     * @param e optional param for the mouse event that initiated the redirect
     */
    redirect: (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => void;

    /**
     * Goes to the given route, pushing it onto the history stack. 
     * This is to be used when you want the current route to remain in the history
     *
     * @param route the route to go to
     * @param e optional param for the mouse event that initiated the push
     */
    pushRoute: (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => void;
}

export function useRedirect(): Redirect {
    const history = useHistory();

    const redirect = (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        history.replace(route);
    };

    const pushRoute = (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        history.push(route);
    };

    return { redirect, pushRoute };
}