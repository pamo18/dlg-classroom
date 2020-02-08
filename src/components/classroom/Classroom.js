/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import './Classroom.css';
import image from "../../assets/classroom/default.jpg";

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.showClassroom = this.showClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.state = {
            title: "Klassrum vy",
            data: [],
            current: {},
            devices: [],
            image: image,
            allOptions: [],
            myOptions: []
        };
    }

    componentDidMount() {
        this.loadClassrooms();
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let allData = {};
            let allOptions = [];

            data.forEach(function(row) {
                let name = row.name;

                allData[name] = row;
                allOptions.push(
                    <option key={ name } value={ name }>{ name }</option>
                );
            });

            that.setState({
                allOptions: allOptions,
                data: allData
            });
        });
    }

    showClassroom(e) {
        let current = this.state.data[e.target.value];

        this.setState({
            current: current
        });

        try {
            let image = require ("../../assets/" + current.image);
            this.setState({
                image: image
            });
        } catch(error) {
            console.log("Image not available");
        }

        this.loadDevices(e.target.value);
    }

    loadDevices(name) {
        let that = this;
        let res = db.fetchAllWhere("classroom/device", name);

        res.then(function(data) {
            that.setState({
                devices: data
            });
        });
    }

    render() {
        let count = 0;
        return (
            <main>
                <div className="page-heading">
                    <h1>
                        { this.state.title }
                    </h1>
                </div>
                <article>
                    <div className="column">
                        <div className="column-1">
                            <form action="/profile" className="form-register" onSubmit={this.registerSubmit}>
                                <label className="form-label">Välj Klassrum
                                    <select className="form-input" type="text" name="classroom" required onChange={ this.showClassroom }>
                                        <optgroup label="Mina klassrum">
                                            { this.state.myClassrooms }
                                        </optgroup>
                                        <optgroup label="Alla klassrum">
                                            { this.state.allOptions }
                                        </optgroup>
                                    </select>
                                </label>
                            </form>
                        </div>
                    </div>
                    <div className="double-column">
                        <div className="column-2">
                            <h2 className="center margin">
                                De La Gardiegymnasiet
                                { this.state.current.hasOwnProperty("name")
                                ? " " + this.state.current.name
                                : null
                                }
                            </h2>
                            <div className="classroom-image">
                                <img src={ this.state.image } alt="Classroom image"/>
                                <table className="results">
                                    <thead>
                                        <tr>
                                            <th>Enhet</th>
                                            <th>Katagori</th>
                                            <th>Märke</th>
                                            <th>Model</th>
                                            <th>Info</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.devices.map(function(device) {
                                            return [
                                                <tr key={device.id}>
                                                    <td>{ ++count }</td>
                                                    <td>{ device.category }</td>
                                                    <td>{ device.brand }</td>
                                                    <td>{ device.model }</td>
                                                    <td>{ device.message }</td>
                                                </tr>
                                            ]})
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default Classroom;
