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
    const { isAuth } = useAuth();
    const { isAdmin } = useAdmin();

    if (isAuth === null || isAdmin === null) {
        return null;
    };

    return (
        <Route exact path={ path } render={ (props) => (
            isAuth && isAdmin
                ?
                <ErrorBoundary key={path}>
                    <Component save={ save } restore={ restore } {...props} />
                </ErrorBoundary>
                :
                <Redirect to="/" />
            )}
        />
    );
}

export default AdminRoute;
