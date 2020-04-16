import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth, useAdmin } from "../auth/auth.js";

function AdminNav({
    to: to ,
    activeClassName: activeClassName,
    name: name
    }) {
    const isAuthenticated = useAuth();
    const isAdmin = useAdmin();

    if (isAuthenticated === null || isAdmin === null) {
        return null;
    };

    return (
        isAuthenticated && isAdmin
            ?
            <NavLink to={ to } activeClassName={ activeClassName }>{ name }</NavLink >
            :
            null
    );
}

export default AdminNav;
