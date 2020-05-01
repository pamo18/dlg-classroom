/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import form from '../../../../models/form.js';
import '../../Admin.css';
import DeviceCards from '../../../device/DeviceCards.js';

class AddDevice extends Component {
    constructor(props) {
        super(props);
        this.addDevice = this.addDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
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
            classroom: {},
            classroomSelected: null,
            classroomDevices: [],
            selection : [
                ["category-caption-advanced", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        this.loadClassrooms();
        this.loadDevices();
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

    addDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let classroomid = data.get("classroomid");
        let deviceid = data.get("deviceid");
        let classroomDevice = {
            classroom_id: classroomid
        };

        let res = db.update("device", deviceid, classroomDevice);

        res.then(() => {
            this.devices.updateData([]);

            this.setState({
                device: {},
                deviceGroups: [],
                selectedDevice: null
            }, () => {
                this.reload();
            });
        });
    }

    removeDevice(deviceid) {
        let classroomDevice = {
            classroom_id: null
        };
        let res = db.update("device", deviceid, classroomDevice);

        res.then(() => this.reload());
    }

    deviceHandler(id) {
        let device = this.state.deviceData[id];

        this.devices.updateData([device]);

        this.setState({
            device: device,
            selectedDevice: id
        });
    }

    classroomHandler(id) {
        let classroom = this.state.classroomData[id];

        this.setState({
            classroom: classroom,
            classroomSelected: classroom.id
        }, () => this.loadClassroomDevices(id));
    }

    loadClassroomDevices(id) {
        let res = db.fetchAllWhere("classroom/device", "classroom_id", id);

        res.then((data) => {
            this.classroomDevices.updateData(data);

            this.setState({
                classroomDevices: data
            });
        });
    }

    // Reload classrooms, devices and classroom devices to update any changes
    reload() {
        let id = this.state.classroom.id;

        this.loadClassrooms();
        this.loadDevices();
        this.classroomHandler(id);
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form action="/admin" className="form-register" onSubmit={ this.addDevice }>
                    <input className="form-input" type="hidden" name="classroomid" required value={ this.state.classroom.id } />
                    <input className="form-input" type="hidden" name="deviceid" required value={ this.state.device.id } />

                    <label className="form-label">Välj klassrum
                        <select className="form-input" type="text" name="classroom" required onChange={ (e) => this.classroomHandler(e.target.value) }>
                            <option disabled selected>Klicka här för att välja Klassrum</option>
                            { this.getClassroomGroups() }
                        </select>
                    </label>

                    { Object.entries(this.state.classroom).length > 0
                        ?
                        <div>
                            <h3 class="center">{ `Antal utrustning: ${ this.state.classroomDevices.length }` }</h3>
                            <DeviceCards
                                onRef={ref => (this.classroomDevices = ref)}
                                devices={ this.state.classroomDevices }
                                choice={ ["status", "view", "unlink"] }
                                selection={ this.state.selection }
                                callbacks={ { "unlink": this.removeDevice } }
                            />
                        </div>
                        : null
                    }

                    <label className="form-label">Välj uttrustning
                        <select className="form-input" type="text" name="default" required onChange={ (e) => this.deviceHandler(e.target.value) }>
                            <option disabled selected>Klicka här för att välja uttrustning</option>
                            { this.state.deviceGroups }
                        </select>
                    </label>

                    <DeviceCards
                        onRef={ref => (this.devices = ref)}
                        devices={ this.state.device }
                        choice={ ["status", "view"] }
                        selection={ this.state.selection }
                    />

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
