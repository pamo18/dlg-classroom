import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../auth/auth.js";

function PrivateRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const isAuthenticated = useAuth();

    if (isAuthenticated === null) {
        return null;
    };

    return (
        <Route exact path={ path } render={ () => (
            isAuthenticated
                ?
                <Component save={ save } restore={ restore } />
                :
                <Redirect to="/login" />
            )}
        />
    );
}

export default PrivateRoute;
