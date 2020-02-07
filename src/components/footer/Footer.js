/*eslint max-len: ["error", { "code": 120 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../navbar/Navbar.js';
import './Footer.css';
// import auth from '../../models/auth.js';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallet: "",
            orders: "",
            profile: "",
            register: "",
            logstatus: "Logga in"
        };
    }

    render() {
        const checkActive = (match, location) => {
            if (!location) {
                return false;
            }
            const {pathname} = location;

            return pathname === "/";
        };

        return (
            <footer className="site-footer">
                <div className="copyright">Copyright 2019 Paul Moreland</div>
                <Navbar />
            </footer>
        );
    }
}

export default Footer;
