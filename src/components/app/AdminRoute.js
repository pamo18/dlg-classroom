import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth, useAdmin } from "../auth/auth.js";

function AdminRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const isAuthenticated = useAuth();
    const isAdmin = useAdmin();

    if (isAuthenticated === null || isAdmin === null) {
        return null;
    };

    return (
        <Route exact path={ path } render={ () => (
            isAuthenticated && isAdmin
                ?
                <Component save={ save } restore={ restore } />
                :
                <Redirect to="/" />
            )}
        />
    );
}

export default AdminRoute;
