/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Link } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import table from '../../models/table.js';
import image from '../../models/image.js';
import icon from '../../models/icon.js';
import './Classroom.css';

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.showClassroom = this.showClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.getDevices = this.getDevices.bind(this);
        this.classroomHandler = this.classroomHandler.bind(this);
        this.filterHandler = this.filterHandler.bind(this);
        this.state = {
            title: "Klassrum vy",
            myOptions: [],
            buildings: [],
            classroomTemplate: "name",
            classroomData: [],
            classroomGroups: [],
            classroomDevicesTable: {},
            classroomDevicesCount: null,
            classroomSelected: null,
            classroom: {
                image: ""
            },
            name: null,
            devices: [],
            filters: []
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomState");

        if (state) {
            this.setState(state, () => {
                if (this.state.classroom.hasOwnProperty("id")) {
                    // Reload classrooms and devices
                    this.loadClassrooms();
                    this.loadDevices(this.state.classroom.id);
                }
            });
        }
        // Load buildings
        this.buildings();
        // Load classrooms
        this.loadClassrooms();
    }

    componentWillUnmount() {
        this.props.save("classroomState", this.state);
    }

    buildings() {
        let res = db.fetchAll("building");
        let that = this;

        res.then(function(data) {
            let filters = that.state.filters;

            that.setState({
                buildings: data
            });
        });

    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");
        let selected = function(id) {
            return that.state.selected == id ? "selected" : null;
        };

        res.then(function(data) {
            let organize = form.organize(data, "location", "id", that.state.filters);
            let classroomData = organize.data;
            let classroomGroups = organize.groups;

            let selected = function(id) {
                return that.state.classroomSelected == id ? "selected" : null;
            };
            let template = that.state.classroomTemplate;

            let formGroups = form.group(classroomGroups, "id", template, selected);

            that.setState({
                classroomData: classroomData,
                classroomGroups: formGroups
            });
        });
    }

    showClassroom(id) {
        try {
            let res = this.state.classroomData[id];
            let name = form.optionName(res, this.state.classroomTemplate);

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
        let res = db.fetchAllWhere("classroom/device", "classroom_id", id);

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

    classroomHandler(e) {
        let id = e.target.value;

        this.setState({
            classroomSelected: id
        }, () => this.showClassroom(id));
    }

    filterHandler(e) {
        let filter = e.target.value;
        let filters = this.state.filters;

        if (!filters.includes(filter)) {
            this.state.filters.push(filter);
        } else {
            let updatedFilters = filters.filter(item => item != filter);

            this.setState({
                filters: updatedFilters
            });
        }

        this.loadClassrooms();
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
                                <div className="filters">
                                    { this.state.buildings.map((house) => {
                                        return [
                                            <button
                                                className={ this.state.filters.includes(house.name) ? "toggle-button on" : "toggle-button" }
                                                type="button"
                                                value={ house.name }
                                                onClick={ this.filterHandler }>{ house.name }</button>
                                        ];
                                    }) }
                                </div>
                                <select className="form-input" type="text" name="classroom" required onChange={ this.classroomHandler }>
                                    <option disabled selected={!this.state.delected ? "selected" : null}>Klicka för att välja</option>
                                    <optgroup label="Mina klassrum">
                                        { this.state.myClassrooms }
                                    </optgroup>
                                    { this.state.classroomGroups }
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
                                    <img src={ image.get(this.state.classroom.image) } alt="Classroom image"/>
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
