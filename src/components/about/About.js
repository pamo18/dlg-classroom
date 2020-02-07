/*eslint max-len: ["error", { "code": 500 }]*/

import React, { Component } from 'react';
import './About.css';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Om"
        };
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <div className="column">
                        <div className="column-1">
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default About;
