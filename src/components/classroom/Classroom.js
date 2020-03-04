/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import db from '../../models/db.js';
import './Classroom.css';
import image from "../../assets/classroom/default.jpg";

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.showClassroom = this.showClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.adminControls = this.adminControls.bind(this);
        this.state = {
            title: "Klassrum vy",
            data: [],
            groups: [],
            myOptions: [],
            nameTemplate: "name",
            name: null,
            image: image,
            classroom: null,
            devices: []
        };
    }

    componentDidMount() {
        this.loadClassrooms();
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let formData = form.group(data, "location", "id", that.state.nameTemplate);

            that.setState({
                data: formData.data,
                groups: formData.groups
            });
        });
    }

    showClassroom(e) {
        let id = e.target.value;

        try {
            let res = this.state.data[id];
            let name = form.optionName(res, this.state.nameTemplate);

            try {
                this.setState({
                    image: require(`../../assets/classroom/${res.image}`)
                });
            } catch(error) {
                console.log(error);
            }

            this.setState({
                name: name,
                classroom: {
                    id: res.id,
                    name: res.name,
                    type: res.type,
                    location: res.location,
                    level: res.level,
                    image: res.image
                },
                image: image
            }, () => this.loadDevices(id));
        } catch(err) {
            console.log(err);
        }
    }

    loadDevices(id) {
        let that = this;
        let res = db.fetchAllWhere("classroom/device", id);

        res.then(function(data) {
            that.setState({
                devices: data
            });
        });
    }

    adminControls() {
        return [
            <div className="admin-control-bar">
                <Link className="button" to={{
                    pathname: "/admin",
                    state: {
                        admin: "classroom",
                        type: "update"
                    }
                }}>Uppdatera</Link>

                <Link className="button" to={{
                    pathname: "/admin",
                    state: {
                        admin: "classroom",
                        type: "delete"
                    }
                }}>Radera</Link>
            </div>
        ]
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
                            <form action="/profile" className="form" onSubmit={this.registerSubmit}>
                                <label className="form-label">Välj Klassrum
                                    <select className="form-input" type="text" name="classroom" required onChange={ this.showClassroom }>
                                        <option disabled selected>Klicka för att välja</option>
                                        <optgroup label="Mina klassrum">
                                            { this.state.myClassrooms }
                                        </optgroup>
                                        { this.state.groups }
                                    </select>
                                </label>
                            </form>
                        </div>
                    </div>
                    <div className="double-column">
                        <div className="column-2">
                            <h2 className="center margin">
                                De La Gardiegymnasiet
                                { this.state.name
                                ? " " + this.state.name
                                : null
                                }
                            </h2>
                            <div className="classroom-image">
                                <img src={ this.state.image } alt="Classroom image"/>
                            </div>
                            { this.adminControls() }
                            <table className="results">
                                <thead>
                                    <tr>
                                        <th>Apparat</th>
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
                </article>
            </main>
        );
    }
}

export default Classroom;
