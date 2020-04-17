import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth, useAdmin } from "../auth/auth.js";

function AdminRoute({
    path: path ,
    component: Component,
    save: save,
    restore: restore
    }) {
    const { isAuth } = useAuth();
    const isAdmin = useAdmin();

    if (isAuth === null || isAdmin === null) {
        return null;
    };

    return (
        <Route exact path={ path } render={ (props) => (
            isAuth && isAdmin
                ?
                <Component save={ save } restore={ restore } {...props} />
                :
                <Redirect to="/" />
            )}
        />
    );
}

export default AdminRoute;
