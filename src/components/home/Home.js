/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import table from '../../models/table.js';
import image from '../../models/image.js';
import icon from '../../models/icon.js';
import './Home.css';
import Categories from '../filter/Categories.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.getClassroom = this.getClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.getDevices = this.getDevices.bind(this);
        this.classroomHandler = this.classroomHandler.bind(this);
        this.filterHandler = this.filterHandler.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = {
            title: "Klassrums vy",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            buildings: [],
            classroomTemplate: "name",
            classroomData: [],
            classroomGroups: [],
            classroomDevicesTable: {
                head: [],
                body: []
            },
            classroomSelected: null,
            classroom: {},
            name: null,
            devices: [],
            filter: {},
            selection : [
                ["category-caption-simple-large", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        let state = this.props.restore("homeState");

        if (state) {
            this.setState(state, () => {
                if (this.state.classroom.hasOwnProperty("id")) {
                    // Reload classrooms and devices
                    this.loadClassrooms();
                    this.getClassroom(this.state.classroom.id);
                    this.loadDevices(this.state.classroom.id);
                }
            });
        } else {
            // Load buildings
            this.buildings();
            // Load classrooms
            this.loadClassrooms();
        }
    }

    componentWillUnmount() {
        this.props.save("homeState", this.state);
        window.scrollTo(0, 0);
    }

    buildings() {
        let res = db.fetchAll("classroom/building");

        res.then((data) => {
            this.setState({
                buildings: data
            });
        });

    }

    loadClassrooms() {
        let res = db.fetchAll("classroom");
        let filter = this.state.filter.building;

        res.then((data) => {
            let organize = form.organize(data, "building", "id", filter != "Alla" ? filter : null);
            let classroomData = organize.data;
            let classroomGroups = organize.groups;

            let selected = (id) => {
                return this.state.classroomSelected == id ? "selected" : null;
            };
            let template = this.state.classroomTemplate;

            let formGroups = form.group(classroomGroups, "id", template, selected);

            this.setState({
                classroomData: classroomData,
                classroomGroups: formGroups
            });
        });
    }

    getClassroom(id) {
        try {
            let classroom = this.state.classroomData[id];
            let name = form.optionName(classroom, this.state.classroomTemplate);
            let report = () => utils.redirect(this, "/report", { itemGroup: "classroom", itemid: classroom.id });
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: classroom.id });
            let reportStatus = db.reportCheck("classroom", classroom.id);

            reportStatus.then((status) => {
                this.setState({
                    name: name,
                    classroom: {
                        id: classroom.id,
                        name: classroom.name,
                        type: classroom.type,
                        building: classroom.building,
                        level: classroom.level,
                        image: classroom.image,
                        report: icon.get("Build", report),
                        status: icon.reportStatus(reportList, status)
                    },
                    selected: classroom.id
                }, () => this.loadDevices(id));
            });
        } catch(err) {
            console.log(err);
        }
    }

    loadDevices(id) {
        let res = db.fetchAllWhere("classroom/device", "classroom_id", id);

        res.then((data) => {
            this.setState({
                devices: data
            }, () => this.getDevices());
        });
    }

    getDevices() {
        let selection = this.state.selection;

        let deviceRows = this.state.devices.map(async (device) => {
            let view = () => utils.redirect(this, "/device", {id: device.id});
            let report = () => utils.redirect(this, "/report", { itemGroup: "device", itemid: device.id });
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: device.id });
            let status = await db.reportCheck("device", device.id);
            let actions = [
                icon.reportStatus(reportList, status),
                icon.get("Build", report),
                icon.get("View", view)
            ];

            return table.deviceBody(device, selection, actions);
        });

        Promise.all(deviceRows).then((rows) => {
            this.setState({
                classroomDevicesTable: {
                    body: rows
                }
            }, () => this.scroll());
        });
    }

    classroomHandler(e) {
        let id = e.target.value;

        this.setState({
            classroomSelected: id
        }, () => this.getClassroom(id));
    }

    filterHandler(category, filter) {
        let currentFilter = this.state.filter;

        currentFilter[category] = filter;

        this.setState({
            filter: currentFilter
        }, () => this.loadClassrooms(this.state.filter));
    }

    toggleFilter() {
        this.setState({
            toggle: this.state.toggle === "close" ? "open" : "close"
        });
    }

    scroll() {
        if (this.ref.current) {
            this.ref.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            })
        }
    }

    render() {
        return (
            <main>
                <div className="left-column">
                    <div className="column-heading left-heading">
                        <h2>Välj Klassrum</h2>
                    </div>
                    <aside className="panel home-panel">
                        <div ref={ this.ref } className="controller">
                            <div className="control-group">
                                <h2 className="center margin">Välj</h2>
                                <select className="form-input" type="text" name="classroom" required onChange={ this.classroomHandler }>
                                    <option disabled>Klassrum</option>
                                    { this.state.classroomGroups }
                                </select>
                            </div>
                        </div>

                        <div className={`filter-panel ${ this.state.toggle }`}>
                            <div className="dropdown">
                                { icon.get(this.state.toggle === "close" ? "Drop-down" : "Drop-up", this.toggleFilter) }
                            </div>
                            <Categories
                                title="Filter Hus"
                                filterCb={ this.filterHandler }
                                url="classroom/building"
                                category="building"
                                stateName="homeCategory1"
                                save={ this.props.save }
                                restore={ this.props.restore }
                            />
                        </div>
                    </aside>
                </div>
                <div className="main-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article>
                        <div>
                            <h2 className="center margin">
                                DLG
                                { this.state.name
                                    ?
                                    <span className="classroom-name"> { this.state.name } { this.state.classroom.status } { this.state.classroom.report }</span>
                                    : null
                                }
                            </h2>
                            <div className="home-image">
                                <img src={ image.get(this.state.classroom.image) } alt="Classroom"/>
                            </div>
                        </div>

                        { this.state.classroomDevicesTable.body.length > 0
                            ?
                            <h3 class="center">{ `Antal utrustning: ${ this.state.classroomDevicesTable.body.length}` }</h3>
                            :
                            null
                        }

                        { this.state.classroomDevicesTable.body.length > 0
                            ?
                            <table className="results-card">
                                <tbody>
                                    { this.state.classroomDevicesTable.body }
                                </tbody>
                            </table>
                            :
                            null
                        }
                    </article>
                </div>
            </main>
        );
    }
}

export default withRouter(Home);
