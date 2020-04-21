/* eslint-disable no-useless-rename */

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/auth.js";

function PrivateNav({
    to: to ,
    isActive: isActive,
    activeClassName: activeClassName,
    name: name
    }) {
    const { isAuth } = useAuth()

    if (isAuth === null) {
        return null;
    };

    return (
        isAuth
            ?
            <NavLink to={ to } isActive={ isActive || null } activeClassName={ activeClassName }>{ name }</NavLink >
            :
            null
    );
}

export default PrivateNav;
