/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../auth/auth.js";
import Navbar from '../navbar/Navbar.js';
import logo from '../../assets/img/classroom.png';
import './Header.css';

class Header extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            title: "DLG Klassrum"
        };
    }

    render() {
        return (
            <header className="site-header">
                <div className="sitle-heading">
                    <NavLink to={ this.context.isAuth ? "/" : "/login" }>
                        <img src={logo} className="site-logo" alt="logo" />
                        <p>{ this.state.title }</p>
                    </NavLink >
                </div>
                <Navbar auth={ this.props.auth } admin={ this.props.admin } />
            </header>
        );
    }
}

export default Header;
