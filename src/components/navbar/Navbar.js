/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../auth/auth.js";
import PrivateNav from './PrivateNav.js';
import AdminNav from './AdminNav.js';
import './Navbar.css';

class Navbar extends Component {
    static contextType = AuthContext;
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

        let start = [
            "/", "/report", "/report/list", "/report/page", "/device", "/classroom"
        ];

        return start.includes(pathname);
    };

    render() {
        return (
            <nav className="navbar">
                <PrivateNav to="/" activeClassName="selected-nav" isActive={ this.checkActiveRoot } name="Start" />
                <PrivateNav to="/me" activeClassName="selected-nav" name="Min Sida" />
                <AdminNav to="/admin" activeClassName="selected-nav" name="Admin" />
                <NavLink to="/login" className="admin" activeClassName="selected-nav">{ !this.context.isAuth ? "Logga in" : "Logga ut" }</NavLink >
                { !this.context.isAuth ? <NavLink to="/register" activeClassName="selected-nav">Registrera</NavLink >: null }
            </nav>
        );
    }
}

export default Navbar;
