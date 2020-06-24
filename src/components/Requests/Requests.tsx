import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { RequestForm } from "../RequestForm/RequestForm";


export const Requests: React.FunctionComponent<any> = (props) => {

    return (
        <HashRouter>
            <Switch>
                <Route path="/Requests/new">
                    <RequestForm />
                </Route>
            </Switch>
        </HashRouter>
    );
}