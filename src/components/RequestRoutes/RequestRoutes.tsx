import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { RequestForm } from "../RequestForm/RequestForm";
import { Requests } from "../Requests/Requests";


export const RequestRoutes: React.FunctionComponent<any> = (props) => {

    return (
        <HashRouter>
            <Switch>
                <Route path="/Requests/new">
                    <RequestForm />
                </Route>
                <Route path="/Requests">
                    <Requests />
                </Route>
            </Switch>
        </HashRouter>
    );
}