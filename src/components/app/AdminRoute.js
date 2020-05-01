/* eslint-disable no-useless-rename */

import React from "react";
import ErrorBoundary from './ErrorBoundary.js';
import { Route, Redirect } from "react-router-dom";
import { useAuth, useAdmin } from "../auth/auth.js";

function AdminRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const { isAuth, isLoggedIn, setAuth } = useAuth();
    const { isAdmin } = useAdmin();
    const loggedIn = isLoggedIn();

    if (isAuth === null || isAdmin === null) {
        return null;
    };

    if (!loggedIn) {
        setAuth(null, null);
    };

    return (
        <Route exact path={ path } render={ (props) => (
            isAuth && isAdmin && loggedIn
                ?
                <ErrorBoundary key={path}>
                    <Component save={ save } restore={ restore } {...props} />
                </ErrorBoundary>
                :
                <Redirect to={isAuth && loggedIn ? "/" : "/login"} />
            )}
        />
    );
}

export default AdminRoute;
