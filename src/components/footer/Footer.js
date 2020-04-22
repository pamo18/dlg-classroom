/*eslint max-len: ["error", { "code": 120 }]*/

import React, { Component } from 'react';
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
                <div className="copyright">&copy; 2020 Paul Moreland, Pamosystems</div>
                <Navbar />
            </footer>
        );
    }
}

export default Footer;
