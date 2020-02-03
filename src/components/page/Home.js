/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
// import auth from '../../models/auth.js';
import base from '../../config/api.js';
import utils from '../../models/utils.js';
import db from '../../models/database.js';

const api = base.api();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Hem",
            classrooms: "",
            myClassrooms: "",
            options: []
        };
    }

    componentDidMount() {
        this.setState({
            classrooms: db.getClassrooms()
        });
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>{ this.state.title}</h1>
                </div>
                <article>
                    <div className="column">
                        <div className="column-1">
                            <div className="graph-picker">
                                { this.state.options }
                            </div>
                            <form action="/profile" className="form-register" onSubmit={this.registerSubmit}>
                                <label className="form-label">Välj Klasrum
                                    <select onChange={this.addToCommon} className="form-input" type="text" name="country" required value={this.state.selectedCountry} placeholder="Your current location">
                                        <optgroup label="Mina klassrum">
                                            { this.state.myClassrooms }
                                        </optgroup>
                                        <optgroup label="Andra klassrum">
                                            { this.state.classrooms }
                                        </optgroup>
                                    </select>
                                </label>
                            </form>
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default Home;
