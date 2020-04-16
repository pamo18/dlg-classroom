import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/auth.js";

function PrivateNav({
    to: to ,
    isActive: isActive,
    activeClassName: activeClassName,
    name: name
    }) {
    const isAuthenticated = useAuth();

    if (isAuthenticated === null) {
        return null;
    };

    return (
        isAuthenticated
            ?
            <NavLink to={ to } isActive={ isActive || null } activeClassName={ activeClassName }>{ name }</NavLink >
            :
            null
    );
}

export default PrivateNav;
