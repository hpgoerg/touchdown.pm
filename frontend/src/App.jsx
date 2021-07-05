/**
 * @module App
 *
 * @description
 * root functional component of the React application
 *
 * @author Hans-Peter Görg
 **/

import React from 'react';
import {setBackendConfigProduction} from "./action/actionSetBackendConfig";
import LoginView from './views/Login/LoginView';
import UpdatePasswordView from "./views/UpdatePassword/UpdatePasswordView";
import ToolbarView from "./views/Toolbar/ToolbarView";
import {Route, Switch, Redirect} from 'react-router-dom';
import EpicsViewContainer from "./views/Epics/EpicsViewContainer";
import ReleasesViewContainer from "./views/Releases/ReleasesViewContainer";
import UserstoriesViewContainer from "./views/Userstories/UserstoriesViewContainer";
import ImpedimentsViewContainer from "./views/Impediments/ImpedimentsViewContainer";
import SprintsViewContainer from "./views/Sprint/SprintsViewContainer";
import MembersViewContainer from "./views/Members/MembersViewContainer";
import {hasActiveAccount} from "./model/account";

/**
 * This is the functional React root component
 *
 * It loads configuration data from the rest server and defines the routing
 *
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
    getConfig();

    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <ToolbarView subject={""}></ToolbarView>
                </Route>
                <Route
                    path="/epics"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        } else {
                            return <EpicsViewContainer/>;
                        }
                    }}
                />
                <Route
                    exact path="/userstories"
                    render={() => {
                        if (!hasActiveAccount("userstories")) {
                            return <Redirect to="/login"/>;
                        }
                        return <UserstoriesViewContainer/>;
                    }}
                />
                <Route
                    path="/sprints"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        }
                        return <SprintsViewContainer/>;
                    }}
                />
                <Route
                    path="/releases"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        }
                        return <ReleasesViewContainer/>;
                    }}
                />
                <Route
                    path="/impediments"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        }
                        return <ImpedimentsViewContainer/>;
                    }}
                />
                <Route
                    path="/members"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        }
                        return <MembersViewContainer/>;
                    }}
                />
                <Route path="/login">
                    <LoginView></LoginView>
                </Route>
                <Route
                    path="/updatePassword"
                    render={() => {
                        if (!hasActiveAccount()) {
                            return <Redirect to="/login"/>;
                        }
                        return <UpdatePasswordView/>;
                    }}
                />
                <Route>
                    <LoginView></LoginView>
                </Route>
            </Switch>

        </div>
    );
}

/**
 * loading configuration data from rest server.
 *
 * Intention for loading configuration data from the rest server is
 * to avoid editing configuration data in two places
 */
const getConfig = () => {
    const execute = async () => {
        await setBackendConfigProduction();
    }
    execute();
};

export default App;
