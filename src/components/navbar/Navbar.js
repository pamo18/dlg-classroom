/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PrivateNav from './PrivateNav.js';
import AdminNav from './AdminNav.js';
import { AuthContext, AdminContext } from "../auth/auth.js";
import './Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.checkActiveRoot = this.checkActiveRoot.bind(this);
        this.state = {};
    }

    checkActiveRoot(match, location) {
        if (!location) {
            return false;
        }
        const {pathname} = location;

        return pathname === "/";
    };

    render() {
        return (
            <AuthContext.Provider value={ this.props.auth }>
                <AdminContext.Provider value={ this.props.admin }>
                    <nav className="navbar">
                        <PrivateNav to="/" activeClassName="selected-nav" isActive={ this.checkActiveRoot } name="Start" />
                        <PrivateNav to="/about" activeClassName="selected-nav" name="Om" />
                        <AdminNav to="/admin" activeClassName="selected-nav" name="Admin" />
                        <NavLink to="/login" className="admin" activeClassName="selected-nav">{ !this.props.auth ? "Logga in" : "Logga ut" }</NavLink >
                        { !this.props.auth ? <NavLink to="/register" activeClassName="selected-nav">Registrera</NavLink >: null }
                    </nav>
                </AdminContext.Provider>
            </AuthContext.Provider>
        );
    }
}

export default Navbar;
