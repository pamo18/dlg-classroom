/* eslint-disable no-useless-rename */

import React from "react";
import ErrorBoundary from './ErrorBoundary.js';
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../auth/auth.js";

function PrivateRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const { isAuth, isLoggedIn, setAuth } = useAuth();
    const loggedIn = isLoggedIn();

    if (isAuth === null) {
        return null;
    };

    if (!loggedIn) {
        setAuth(null, null);
    };

    return (
        <Route exact path={ path } render={ props => (
            isAuth && loggedIn
                ?
                <ErrorBoundary key={path}>
                    <Component save={ save } restore={ restore } {...props} />
                </ErrorBoundary>
                :
                <Redirect to={{
                    pathname: "/login",
                    state: { from: props.location }
                    }}
                />
            )}
        />
    );
}

export default PrivateRoute;
