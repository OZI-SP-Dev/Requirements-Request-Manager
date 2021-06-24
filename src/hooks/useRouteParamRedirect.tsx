import { useEffect } from "react";

export const useRouteParamRedirect = (): void => {
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get("route");

    useEffect(() => {
        if (routeParam) { // decode the URL encoding as the browser doesn't seem to do it for us
            window.location.replace(`${window.location.origin}${window.location.pathname}${decodeURIComponent(routeParam)}`);
        }
    }, [routeParam]);
}