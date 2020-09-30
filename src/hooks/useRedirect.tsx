import { useHistory } from "react-router-dom";

interface Redirect {
    redirect: (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => void;
}

export function useRedirect(): Redirect {
    const history = useHistory();

    const redirect = (route: string, e?: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        history.push(route);
    };

    return { redirect };
}