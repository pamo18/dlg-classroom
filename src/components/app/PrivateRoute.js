import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../auth/auth.js";

function PrivateRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const { isAuth } = useAuth();

    if (isAuth === null) {
        return null;
    };

    return (
        <Route exact path={ path } render={ props => (
            isAuth
                ?
                <Component save={ save } restore={ restore } {...props} />
                :
                <Redirect to="/login" />
            )}
        />
    );
}

export default PrivateRoute;
