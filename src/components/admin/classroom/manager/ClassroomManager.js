/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Link } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import table from '../../../../models/table.js';
import icon from '../../../../models/icon.js';
import '../../Admin.css';

class ClassroomManager extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.getClassroom1Groups = this.getClassroom1Groups.bind(this);
        this.getClassroom2Groups = this.getClassroom2Groups.bind(this);
        this.getDevice = this.getDevice.bind(this);
        this.getDeviceGroups = this.getDeviceGroups.bind(this);
        this.getClassroomDevice = this.getClassroomDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
        this.reload = this.reload.bind(this);
        this.deviceHandler = this.deviceHandler.bind(this);
        this.classroom1Handler = this.classroom1Handler.bind(this);
        this.classroom2Handler = this.classroom2Handler.bind(this);
        this.changeType = this.changeType.bind(this);
        this.state = {
            title: " apparater i ett klassrum",
            classroomNameTemplate: "name",
            deviceNameTemplate: "brand,model,(serialnum)",
            classroomData: [],
            classroomGroups: {},
            deviceData: [],
            deviceGroups: [],
            selectedDevice: null,
            device: {},
            deviceTable: {},
            classroom1: {},
            classroom1Selected: null,
            classroom1Devices: [],
            classroom1DevicesTable: {},
            classroom1DevicesCount: null,
            classroom2: {},
            classroom2Selected: null,
            classroom2Devices: [],
            classroom2DevicesTable: {},
            classroom2DevicesCount: null,
            type: "Lägg till"
        };
    }

    componentDidMount() {
        let state = this.props.restore("managerState");

        if (state) {
            this.setState(state, () => this.reload());
        } else {
            this.loadClassrooms();
            this.loadDevices();
        }
    }

    componentWillUnmount() {
        this.props.save("managerState", this.state);
    }

    // Load Classrooms and group data - Step 1
    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let organize = form.organize(data, "location", "id");
            let classroomData = organize.data;
            let classroomGroups = organize.groups;
            let classroom1Groups = that.getClassroom1Groups(classroomGroups);

            that.setState({
                classroomData: classroomData,
                classroomGroups: classroomGroups,
                classroom1Groups: classroom1Groups
            });
        });
    }

    // Load Classrooms1 form groups - Step 2 - Get Formdata
    getClassroom1Groups(data = null) {
        if (!data) {
            data = this.state.classroomGroups;
        }

        let that = this;
        let template = this.state.classroomNameTemplate;
        let classroom2 = this.state.classroom2Selected;

        let selected = function(id) {
            return that.state.classroom1Selected == id ? "selected" : null;
        };

        let groups = form.group(data, "id", template, selected, classroom2);

        return groups;
    }

    // Load Classrooms2 form groups - Step 3 optional - Get Formdata
    getClassroom2Groups(data = null) {
        if (!data) {
            data = this.state.classroomGroups;
        }

        let that = this;
        let template = this.state.classroomNameTemplate;
        let classroom1 = this.state.classroom1Selected;

        let selected = function(id) {
            return that.state.classroom2Selected == id ? "selected" : null;
        };

        let groups = form.group(data, "id", template, selected, classroom1);

        return groups;
    }

    // Load Devices - Step 1
    loadDevices() {
        let that = this;
        let allData = {};
        let groups = {};
        let res = db.fetchAll("device/available");

        res.then(function(data) {
            that.getDeviceGroups(data);
        });
    }

    // Load Devices - Step 2 - Get Formdata
    getDeviceGroups(data) {
        let that = this;
        let selected = function(id) {
            return that.state.selectedDevice == id ? "selected" : null;
        };
        let organize = form.organize(data, "category", "id");
        let deviceData = organize.data;
        let groupData = organize.groups;
        let deviceGroups = form.group(groupData, "id", this.state.deviceNameTemplate, selected);

        this.setState({
            deviceData: deviceData,
            deviceGroups: deviceGroups
        });
    }

    // Get classroom - Step 1
    getClassroom(id, classroom) {
        try {
            let res = this.state.classroomData[id];
            let details = {
                id: res.id,
                name: res.name,
                type: res.type,
                location: res.location,
                level: res.level,
                image: res.image
            }

            this.setState({
                [classroom]: details,
                [`${classroom}Selected`]: res.id
            }, () => this.loadClassroomDevices(id, classroom));
        } catch(err) {
            console.log(err);
        }
    }

    // Get classroom - Step 2 - Get classroom devices
    loadClassroomDevices(id, classroom) {
        let that = this;
        let res = db.fetchAllWhere("classroom/device", id);

        res.then(function(data) {
            that.setState({
                [`${classroom}Devices`]: data
            }, () => that.getClassroomDevice(classroom));
        });
    }

    // Get classroom - Step 3 - Build classroom devices table rows
    getClassroomDevice(classroom) {
        let count = 0;
        let that = this;
        let classroomDevices = `${classroom}Devices`;
        let classroomid = this.state[classroom].id;

        let classroomDevicesRows = this.state[classroomDevices].map(function(device) {
            let swap;
            let down = () => that.swapDevice(that.state.classroom1.id, that.state.classroom2.id, device.id);
            let up = () => that.swapDevice(that.state.classroom2.id, that.state.classroom1.id, device.id);
            let view = () => utils.redirect(that, "/device", {id: device.id});
            let del = () => that.removeDevice(classroomid, device.id);

            count++;

            if (that.state.type === "Byta" && classroom === "classroom1") {
                swap = icon.get("Down", down);
            } else if (that.state.type === "Byta" && classroom === "classroom2") {
                swap = icon.get("Up", up);
            }

            let key = `${classroom}Device-${device.id}`;
            let admin = [
                icon.get("View", view),
                icon.get("Delete", del),
                swap
            ];

            return table.adminRow(key, device, admin);
        });

        this.setState({
            [`${classroom}DevicesTable`]: {
                head: table.adminHead(),
                body: classroomDevicesRows
            },
            [`${classroom}DevicesCount`]: count
        });
    }

    getDevice(id) {
        try {
            let res = this.state.deviceData[id];
            let purchased = new Date(res.purchased).toISOString().substring(0, 10);
            let expires = new Date(res.expires).toISOString().substring(0, 10);
            let key = `device-${res.id}`;
            let view = () => utils.redirect(this, "/device", {id: res.id});
            let row = table.adminRow(key, res, icon.get("View", view));

            this.setState({
                device: res,
                deviceTable: {
                    head: table.adminHead(),
                    body: row
                },
                selectedDevice: id
            });
        } catch(err) {
            console.log(err);
        }
    }

    addDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let that = this;
        let classroomid = data.get("classroomid");
        let deviceid = data.get("deviceid");
        let classroomDevice = {
            classroom_id: classroomid,
            device_id: deviceid
        };

        let res = db.insert("classroom/device", classroomDevice);

        res.then(function() {
            that.reload();

            that.setState({
                device: {},
                deviceGroups: []
            });
        });
    }

    swapDevice(classroomFrom, classroomTo, deviceid) {
        let classroomDevice = {
            classroom_id: classroomTo
        };

        let res = db.update(
            "classroom/device",
            `${classroomFrom}&${deviceid}`,
            classroomDevice
        );

        res.then(() => this.reload());
    }

    removeDevice(classroomid, deviceid) {
        let res = db.delete("classroom/device", `${classroomid}&${deviceid}`);

        res.then(() => this.reload());
    }

    // Change type, reset bottom options/table then update classroom1 options to include/exclude swap function
    changeType(e) {
        let that = this;
        let type = e.target.value;

        // Add/remove properties and swap arrows for classroom1 -> getClassroomDevice
        if (type === "Lägg till") {
            // Remove classroom2 properties, only classroom1 devices needed
            this.setState({
                type: type,
                classroom2: {},
                classroom2Selected: null
            }, () => this.getClassroomDevice("classroom1"));
        } else if (type === "Byta") {
            // Remove device properties, only classroom1 and classroom2 needed here
            this.setState({
                type: type,
                device: {},
                selectedDevice: null
            }, () => that.getClassroomDevice("classroom1"));
        }
    }

    deviceHandler(e) {
        this.getDevice(e.target.value);
    }

    classroom1Handler(e) {
        this.getClassroom(e.target.value, "classroom1");
    }

    classroom2Handler(e) {
        this.getClassroom(e.target.value, "classroom2");
    }

    reload() {
        let classroom1 = this.state.classroom1.id;

        this.loadClassrooms();
        this.loadDevices();
        this.getClassroom(classroom1, "classroom1");

        if (this.state.type === "Byta") {
            let classroom2 = this.state.classroom2.id;

            this.getClassroom(classroom2, "classroom2");
        }
    }

    render() {
        return (
            <div className="manager-wrapper">
                <h2 className="center">{ this.state.type + this.state.title }</h2>
                <div className="type-control-bar">
                    <button className={this.state.type === "Lägg till" ? "toggle-button add on" : "toggle-button"} type="button" value="Lägg till" onClick={ this.changeType }>Lägg till</button>
                    <button className={this.state.type === "Byta" ? "toggle-button swap on" : "toggle-button"} type="button" value="Byta" onClick={ this.changeType }>Byta</button>
                </div>
                <form action="/admin" className="form-register" onSubmit={ this.addDevice }>
                    <input className="form-input" type="hidden" name="classroomid" required value={ this.state.classroom1.id } />
                    <input className="form-input" type="hidden" name="deviceid" required value={ this.state.device.id } />

                    <label className="form-label">{this.state.type === "Lägg till" ? "Välj klassrum" : "Välj klassrum 1"}
                        <select className="form-input" type="text" name="classroom" required onChange={ this.classroom1Handler }>
                            <option disabled selected>Klicka här för att välja Klassrum</option>
                            { this.getClassroom1Groups() }
                        </select>
                    </label>

                    { Object.entries(this.state.classroom1).length > 0
                        ?
                        <div>
                            <h3 class="center">{ `Antal apparater: ${this.state.classroom1DevicesCount}` }</h3>
                            <table className={ this.state.type === "Lägg till" ? "results" : "results swap" }>
                                <thead>
                                    { this.state.classroom1DevicesTable.head }
                                </thead>
                                <tbody>
                                    { this.state.classroom1DevicesTable.body }
                                </tbody>
                            </table>
                        </div>
                        : null
                    }

                    { this.state.type === "Lägg till"
                        ?
                        <label className="form-label">Välj apparat
                            <select className="form-input" type="text" name="default" required onChange={ this.deviceHandler }>
                                <option disabled selected>Klicka här för att välja apparat</option>
                                { this.state.deviceGroups }
                            </select>
                        </label>
                        :
                        <label className="form-label">Välj klassrum 2
                            <select className="form-input" type="text" name="classroom" required onChange={ this.classroom2Handler }>
                                <option disabled selected>Klicka här för att välja Klassrum</option>
                                { this.getClassroom2Groups() }
                            </select>
                        </label>
                    }

                    { this.state.type === "Lägg till"
                        ?
                            Object.entries(this.state.device).length > 0
                            ?
                            <table className="results add">
                                <thead>
                                    { this.state.deviceTable.head }
                                </thead>
                                <tbody>
                                    { this.state.deviceTable.body }
                                </tbody>
                            </table>
                            :
                            null
                        :
                            Object.entries(this.state.classroom2).length > 0
                            ?
                            <div>
                                <h3 class="center">{ `Antal apparater: ${this.state.classroom2DevicesCount}` }</h3>
                                <table className="results swap">
                                    <thead>
                                        { this.state.classroom2DevicesTable.head }
                                    </thead>
                                    <tbody>
                                        { this.state.classroom2DevicesTable.body }
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                    }

                    { this.state.type === "Lägg till" && Object.entries(this.state.classroom1).length > 0 && Object.entries(this.state.device).length > 0
                        ?
                        <input className="button center-margin" type="submit" name="add" value="Lägg till" />
                        :
                        null
                    }
                </form>
            </div>
        );
    }
}

export default withRouter(ClassroomManager);
