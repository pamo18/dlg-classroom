/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import table from '../../../../models/table.js';
import icon from '../../../../models/icon.js';
import '../../Admin.css';

class AddDevice extends Component {
    constructor(props) {
        super(props);
        this.addDevice = this.addDevice.bind(this);
        this.deviceHandler = this.deviceHandler.bind(this);
        this.classroomHandler = this.classroomHandler.bind(this);
        this.state = {
            title: "Koppla utrustning till ett klassrum",
            classroomNameTemplate: "name",
            deviceNameTemplate: "brand,model,(serialnum)",
            classroomData: [],
            classroomGroups: {},
            classroomFormGroups: [],
            deviceData: [],
            deviceGroups: [],
            selectedDevice: null,
            device: {},
            deviceTable: {},
            classroom: {},
            classroomSelected: null,
            classroomDevices: [],
            classroomDevicesTable: {
                head: [],
                body: []
            },
            selection : [
                ["category-caption-advanced", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        let state = this.props.restore("managerState");

        if (state) {
            this.setState(state, () => {
                if (this.state.classroom.hasOwnProperty("id")) {
                    this.reload();
                }
            });
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
        let res = db.fetchAll("classroom");

        res.then((data) => {
            let organize = form.organize(data, "building", "id");
            let classroomData = organize.data;
            let classroomGroups = organize.groups;
            let classroomFormGroups = this.getClassroomGroups(classroomGroups);

            this.setState({
                classroomData: classroomData,
                classroomGroups: classroomGroups,
                classroomFormGroups: classroomFormGroups
            });
        });
    }

    // Load Classrooms form groups - Step 2 - Get Formdata
    getClassroomGroups(data = null) {
        if (!data) {
            data = this.state.classroomGroups;
        }

        let template = this.state.classroomNameTemplate;
        let selected = (id) => {
            return this.state.classroomSelected == id ? "selected" : null;
        };

        let groups = form.group(data, "id", template, selected);

        return groups;
    }

    // Load Devices - Step 1
    loadDevices() {
        let res = db.fetchAll("device/available");

        res.then((data) => {
            this.getDeviceGroups(data);
        });
    }

    // Load Devices - Step 2 - Get Formdata
    getDeviceGroups(data) {
        let organize = form.organize(data, "category", "id");
        let deviceData = organize.data;
        let groupData = organize.groups;
        let selected = (id) => {
            return this.state.selectedDevice == id ? "selected" : null;
        };

        let deviceGroups = form.group(groupData, "id", this.state.deviceNameTemplate, selected);

        this.setState({
            deviceData: deviceData,
            deviceGroups: deviceGroups
        });
    }

    // Get classroom - Step 1
    getClassroom(id) {
        try {
            let res = this.state.classroomData[id];
            let details = {
                id: res.id,
                name: res.name,
                type: res.type,
                building: res.building,
                level: res.level,
                image: res.image
            }

            this.setState({
                classroom: details,
                classroomSelected: res.id
            }, () => this.loadClassroomDevices(id));
        } catch(err) {
            console.log(err);
        }
    }

    // Get classroom - Step 2 - Get classroom devices
    loadClassroomDevices(id) {
        let res = db.fetchAllWhere("classroom/device", "classroom_id", id);

        res.then((data) => {
            this.setState({
                classroomDevices: data
            }, () => this.getClassroomDevices());
        });
    }

    // Get classroom - Step 3 - Build classroom devices table rows
    getClassroomDevices() {
        let classroomid = this.state.classroom.id;
        let selection = this.state.selection;

        let classroomDevicesRows = this.state.classroomDevices.map(async (device) => {
            let view = () => utils.redirect(this, "/device", {id: device.id});
            let del = () => this.removeDevice(classroomid, device.id);
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: device.id });
            let reportStatus = await db.reportCheck("device", device.id);

            let actions = [
                icon.reportStatus(reportList, reportStatus),
                icon.get("View", view),
                icon.get("Delete", del),
            ];

            return table.deviceBody(device, selection, actions);
        });

        Promise.all(classroomDevicesRows).then((rows) => {
            this.setState({
                classroomDevicesTable: {
                    body: rows
                }
            });
        });
    }

    getDevice(id) {
        try {
            let res = this.state.deviceData[id];
            let selection = this.state.selection;
            let view = () => utils.redirect(this, "/device", {id: res.id});
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: res.id });
            let reportStatus = db.reportCheck("device", res.id);

            reportStatus.then((status) => {
                let actions = [
                    icon.reportStatus(reportList, status),
                    icon.get("View", view)
                ];

                this.setState({
                    device: res,
                    deviceTable: {
                        body: table.deviceBody(res, selection, actions)
                    },
                    selectedDevice: id
                });
            });
        } catch(err) {
            console.log(err);
        }
    }

    addDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let classroomid = data.get("classroomid");
        let deviceid = data.get("deviceid");
        let classroomDevice = {
            classroom_id: classroomid,
            device_id: deviceid
        };

        let res = db.insert("classroom/device", classroomDevice);

        res.then(() => {
            this.reload();

            this.setState({
                device: {},
                deviceGroups: []
            });
        });
    }

    removeDevice(classroomid, deviceid) {
        let res = db.delete("classroom/device", `${classroomid}/${deviceid}`);

        res.then(() => this.reload());
    }

    deviceHandler(e) {
        this.getDevice(e.target.value);
    }

    classroomHandler(e) {
        this.getClassroom(e.target.value);
    }

    // Reload classrooms, devices and classroom devices to update any changes
    reload() {
        let classroom = this.state.classroom.id;

        this.loadClassrooms();
        this.loadDevices();
        this.getClassroom(classroom);
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form action="/admin" className="form-register" onSubmit={ this.addDevice }>
                    <input className="form-input" type="hidden" name="classroomid" required value={ this.state.classroom.id } />
                    <input className="form-input" type="hidden" name="deviceid" required value={ this.state.device.id } />

                    <label className="form-label">Välj klassrum
                        <select className="form-input" type="text" name="classroom" required onChange={ this.classroomHandler }>
                            <option disabled selected>Klicka här för att välja Klassrum</option>
                            { this.getClassroomGroups() }
                        </select>
                    </label>

                    { Object.entries(this.state.classroom).length > 0
                        ?
                        <div>
                            <h3 class="center">{ `Antal apparater: ${ this.state.classroomDevices.length }` }</h3>
                            <table className="results-card">
                                <tbody>
                                    { this.state.classroomDevicesTable.body }
                                </tbody>
                            </table>
                        </div>
                        : null
                    }

                    <label className="form-label">Välj uttrustning
                        <select className="form-input" type="text" name="default" required onChange={ this.deviceHandler }>
                            <option disabled selected>Klicka här för att välja uttrustning</option>
                            { this.state.deviceGroups }
                        </select>
                    </label>

                    {
                        Object.entries(this.state.device).length > 0
                        ?
                        <table className="results-card">
                            <tbody>
                                { this.state.deviceTable.body }
                            </tbody>
                        </table>
                        :
                        null
                    }

                    { Object.entries(this.state.classroom).length > 0 && Object.entries(this.state.device).length > 0
                        ?
                        <input className="button center-margin" type="submit" name="add" value="Lägg till" />
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(AddDevice);
