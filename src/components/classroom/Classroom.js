/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Link } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import table from '../../models/table.js';
import icon from '../../models/icon.js';
import './Classroom.css';
import image from "../../assets/classroom/default.jpg";

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.showClassroom = this.showClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.getDevices = this.getDevices.bind(this);
        this.state = {
            title: "Klassrum vy",
            data: [],
            groups: [],
            myOptions: [],
            nameTemplate: "name",
            name: null,
            image: image,
            classroom: null,
            devices: [],
            classroomDevicesTable: {},
            classroomDevicesCount: null,
            selected: null
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomState");

        if (state) {
            this.setState(state);
        }

        this.loadClassrooms();
    }

    componentWillUnmount() {
        this.props.save("classroomState", this.state);
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");
        let selected = function(id) {
            return that.state.selected == id ? "selected" : null;
        };

        res.then(function(data) {
            let formData = form.group(data, "location", "id", that.state.nameTemplate, selected);

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
                image: image,
                selected: res.id
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
            }, () => that.getDevices());
        });
    }

    getDevices() {
        let count = 0;
        let that = this;

        let classroomDevicesRows = this.state.devices.map(function(device) {
            let view = () => utils.redirect(that, "/device", {id: device.id});
            let key = `device-${device.id}`;

            count++;

            return table.userRow(key, device, icon.get("View", view));
        });

        this.setState({
            classroomDevicesTable: {
                head: table.userHead(),
                body: classroomDevicesRows
            },
            classroomDevicesCount: count
        });
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>
                        { this.state.title }
                    </h1>
                </div>
                <article>
                    <div className="left-column">
                        <div className="classroom-control">
                            <form action="/profile" className="form" onSubmit={this.registerSubmit}>
                                <h2 className="center margin">Välj Klassrum</h2>
                                <select className="form-input" type="text" name="classroom" required onChange={ this.showClassroom }>
                                    <option disabled selected={!this.state.delected ? "selected" : null}>Klicka för att välja</option>
                                    <optgroup label="Mina klassrum">
                                        { this.state.myClassrooms }
                                    </optgroup>
                                    { this.state.groups }
                                </select>
                            </form>
                        </div>
                    </div>
                    <div className="main-column">
                        <div className="classroom-view">
                            <div>
                                <h2 className="center margin">
                                    DLG
                                    { this.state.name
                                    ? " " + this.state.name
                                    : null
                                    }
                                </h2>
                                <div className="classroom-image">
                                    <img src={ this.state.image } alt="Classroom image"/>
                                </div>
                            </div>

                            { this.state.classroomDevicesCount != null
                                ?
                                <h3 class="center">{ `Antal apparater: ${ this.state.classroomDevicesCount}` }</h3>
                                :
                                null
                            }

                            { this.state.classroomDevicesCount
                                ?
                                <table className="results">
                                    <thead>
                                        { this.state.classroomDevicesTable.head }
                                    </thead>
                                    <tbody>
                                        { this.state.classroomDevicesTable.body }
                                    </tbody>
                                </table>
                                :
                                null
                            }
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default withRouter(Classroom);
