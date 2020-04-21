/* eslint-disable no-useless-rename */

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth, useAdmin } from "../auth/auth.js";

function AdminNav({
    to: to ,
    activeClassName: activeClassName,
    name: name
    }) {
    const { isAuth } = useAuth();
    const { isAdmin } = useAdmin();

    if (isAuth === null || isAdmin === null) {
        return null;
    };

    return (
        isAuth && isAdmin
            ?
            <NavLink to={ to } activeClassName={ activeClassName }>{ name }</NavLink >
            :
            null
    );
}

export default AdminNav;
