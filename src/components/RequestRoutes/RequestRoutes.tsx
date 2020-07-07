import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { useRequests } from "../../hooks/useRequests";
import { RequestForm } from "../RequestForm/RequestForm";
import { Requests } from "../Requests/Requests";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    const [requests, updateRequests] = useRequests();

    return (
        <HashRouter>
            <Switch>
                <Route path="/Requests/new">
                    <RequestForm updateRequests={updateRequests} />
                </Route>
                <Route path="/Requests">
                    <Requests requests={requests} />
                </Route>
            </Switch>
        </HashRouter>
    );
}