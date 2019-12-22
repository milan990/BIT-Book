import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import EntryPage from "./EntryPage/EntryPage";
import Main from "./Main";
import AuthenticationService from "../services/AuthenticationService";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.authenticationService = new AuthenticationService();
    }

    render() {
        if (!this.authenticationService.isUserAuthenticated()) {
            return (
                <div className="container">
                    <Switch>
                        <Redirect exact from='/' to='/login' />
                        <Route path='/login' component={EntryPage} />
                        <Route path='/register' component={EntryPage} />
                    </Switch>
                </div>
            );
        }

        return <Main  />;
    }
}