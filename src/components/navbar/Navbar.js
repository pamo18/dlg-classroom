/*eslint max-len: ["error", { "code": 200 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // componentDidMount() {
    //     let that = this;
    //
    //     auth.isactive()
    //         .then(function(res) {
    //             if (res.data.active) {
    //                 that.adminNav();
    //             } else {
    //                 that.registerNav();
    //             }
    //         });
    // }

    // adminNav() {
    //     this.setState({
    //         logstatus: "Logga ut",
    //         wallet: <NavLink to="/wallet" className="admin" activeClassName="selected">My Wallet</NavLink >,
    //         orders: <NavLink to="/orders" activeClassName="selected">My Orders</NavLink >,
    //         profile: <NavLink to="/profile" activeClassName="selected">My Profile</NavLink >
    //     });
    // }

    // registerNav() {
    //     this.setState({
    //         register: <NavLink to="/register" className="admin" activeClassName="selected">Registrera</NavLink >
    //     });
    // }

    render() {
        const checkActive = (match, location) => {
            if (!location) {
                return false;
            }
            const {pathname} = location;

            return pathname === "/";
        };

        return (
            <nav className="navbar">
                <NavLink to="/" activeClassName="selected" isActive={checkActive}>Start</NavLink >
                <NavLink to="/about" activeClassName="selected">Om</NavLink >
                <NavLink to="/admin" activeClassName="selected">Admin</NavLink >
            </nav>
        );
    }
}

export default Navbar;
