/*eslint max-len: ["error", { "code": 120 }]*/

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../navbar/Navbar.js';
import './Footer.css';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <footer className="site-footer">
                <div className="copyright">Copyright 2019 Paul Moreland</div>
                <Navbar auth={ this.props.auth } admin={ this.props.admin } />
            </footer>
        );
    }
}

export default Footer;
