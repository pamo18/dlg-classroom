/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../navbar/Navbar.js';
import logo from '../../assets/img/classroom.jpeg';
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "DLG | Classroom"
        };
    }

    render() {
        return (
            <header className="site-header">
                <div className="sitle-heading">
                    <img src={logo} className="site-logo" alt="logo" />
                    <NavLink to="/">{ this.state.title }</NavLink >
                </div>
                <Navbar auth={ this.props.auth } admin={ this.props.admin } />
            </header>
        );
    }
}

export default Header;
