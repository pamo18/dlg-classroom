/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import '../../Admin.css';
import DeleteIcon from "@material-ui/icons/DeleteForever";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Clone from "lodash";

class ClassroomDeviceCreate extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.getClassroomForm = this.getClassroomForm.bind(this);
        this.getDevice = this.getDevice.bind(this);
        this.getDeviceForm = this.getDeviceForm.bind(this);
        this.getClassroomDevice = this.getClassroomDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
        this.reload = this.reload.bind(this);
        this.changeType = this.changeType.bind(this);
        this.classroom2Groups = this.classroom2Groups.bind(this);
        this.state = {
            title: " apparater i ett klassrum",
            classroomData: [],
            deviceData: [],
            classroomGroups: [],
            classroom2Groups: [],
            deviceGroups: [],
            classroomNameTemplate: "name",
            classroom1: {},
            classroom1Devices: [],
            classroom1DevicesRows: [],
            classroom2: {},
            classroom2Devices: [],
            classroom2DevicesRows: [],
            deviceNameTemplate: "brand,model,(serialnum)",
            device: {},
            type: "Lägg till"
        };
    }

    componentDidMount() {
        this.loadClassrooms();
        this.loadDevices();
    }

    // Load Classrooms - Step 1
    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            that.getClassroomForm(data);
        });
    }

    // Load Classrooms - Step 2 - Get Formdata
    getClassroomForm(data) {
        let formData = form.group(data, "location", "id", this.state.classroomNameTemplate);

        this.setState({
            classroomData: formData.data,
            classroomGroups: formData.groups
        });
    }

    // Load Devices - Step 1
    loadDevices() {
        let that = this;
        let allData = {};
        let groups = {};
        let res = db.fetchAll("device/available");

        res.then(function(data) {
            that.getDeviceForm(data);
        });
    }

    // Load Devices - Step 2 - Get Formdata
    getDeviceForm(data) {
        let formData = form.group(data, "category", "id", this.state.deviceNameTemplate);

        this.setState({
            deviceData: formData.data,
            deviceGroups: formData.groups
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
                [classroom]: details
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

            if (that.state.type === "Byta" && classroom === "classroom1") {
                swap = [
                    <ArrowDownwardIcon
                        onClick={ () => that.swapDevice(that.state.classroom1.id, that.state.classroom2.id, device.id) }
                        className="arrow-down-icon"
                    />
                ]
            } else if (that.state.type === "Byta" && classroom === "classroom2") {
                swap = [
                    <ArrowUpwardIcon
                        onClick={ () => that.swapDevice(that.state.classroom2.id, that.state.classroom1.id, device.id) }
                        className="arrow-up-icon"
                    />
                ]
            }

            return [
                <tr key={ `${classroom}Device-${device.id}` }>
                    <td>{ ++count }</td>
                    <td>{ device.category }</td>
                    <td>{ device.brand }</td>
                    <td>{ device.model }</td>
                    <td>{ device.message }</td>
                    <td>
                        <DeleteIcon
                            onClick={ () => that.removeDevice(classroomid, device.id) }
                            className="delete-icon"
                        />
                        { swap }
                    </td>
                </tr>
            ]
        });

        this.setState({
            [`${classroom}DevicesRows`]: classroomDevicesRows
        });
    }

    getDevice(id) {
        try {
            let res = this.state.deviceData[id];
            let purchased = new Date(res.purchased).toISOString().substring(0, 10);
            let expires = new Date(res.expires).toISOString().substring(0, 10);

            this.setState({
                device: {
                    id: res.id,
                    category: res.category,
                    brand: res.brand,
                    model: res.model,
                    purchased: purchased,
                    expires: expires,
                    warranty: res.warranty,
                    price: res.price,
                    serialnum: res.serialnum,
                    url: res.url,
                    message: res.message
                }
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

    removeDevice(classroomid, deviceid) {
        let that = this;

        let res = db.delete("classroom/device", `${classroomid}&${deviceid}`);

        res.then(() => this.reload());
    }

    swapDevice(classroomFrom, classroomTo, deviceid) {
        let that = this;
        let classroomDevice = {
            classroom_id: classroomTo
        };

        let res = db.update(
            "classroom/device",
            `${classroomFrom}&${classroomTo}&${deviceid}`,
            classroomDevice
        );

        res.then(() => this.reload(classroomFrom, classroomTo));
    }

    reload() {
        let classroom1 = this.state.classroom1.id;
        let classroom2 = this.state.classroom2.id;

        this.loadClassrooms();
        this.loadDevices();
        this.getClassroom(classroom1, "classroom1");
        this.getClassroom(classroom2, "classroom2");

        this.setState({
            deviceData: {}
        });
    }

    changeType(e) {
        this.setState({
            type: e.target.value
        }, () => this.getClassroomDevice("classroom1"));
    }

    classroom2Groups() {
        let that = this;
        try {
            let groups = Clone.cloneDeep(this.state.classroomGroups);

            if (groups.length === 1) {
                let newChildren = groups[0].props.children.filter(function(row) {
                    return row.props.value != that.state.classroom1.id;
                });

                groups[0].props.children = newChildren;

                return groups;
            }
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div className="double-column">
                <div className="admin-column">
                    <div className="form-wrapper">
                        <h2 className="center">{ this.state.type + this.state.title }</h2>
                        <div className="type-control-bar">
                            <button className={this.state.type === "Lägg till" ? "toggle-button on" : "toggle-button"} type="button" value="Lägg till" onClick={ this.changeType }>Lägg till</button>
                            <button className={this.state.type === "Byta" ? "toggle-button on" : "toggle-button"} type="button" value="Byta" onClick={ this.changeType }>Byta</button>
                        </div>
                        <form action="/admin" className="form-register" onSubmit={ this.addDevice }>
                            <input className="form-input" type="hidden" name="classroomid" required value={ this.state.classroom1.id } />
                            <input className="form-input" type="hidden" name="deviceid" required value={ this.state.device.id } />

                            <label className="form-label">Välj klassrum
                                <select className="form-input" type="text" name="classroom" required onChange={ e => this.getClassroom(e.target.value, "classroom1") }>
                                    <option disabled selected>Klicka här för att välja Klassrum</option>
                                    { this.state.classroomGroups }
                                </select>
                            </label>

                            { Object.entries(this.state.classroom1).length > 0
                                ?
                                <table className="results">
                                    <thead>
                                        <tr>
                                            <th>Apparat</th>
                                            <th>Katagori</th>
                                            <th>Märke</th>
                                            <th>Model</th>
                                            <th>Info</th>
                                            <th>Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.classroom1DevicesRows }
                                    </tbody>
                                </table>
                                : null
                            }

                            { this.state.type === "Lägg till"
                                ?
                                <label className="form-label">Välj apparat
                                    <select className="form-input" type="text" name="device" required onChange={ e => this.getDevice(e.target.value) }>
                                        <option disabled selected>Klicka här för att välja apparat</option>
                                        { this.state.deviceGroups }
                                    </select>
                                </label>
                                :
                                <label className="form-label">Välj klassrum
                                    <select className="form-input" type="text" name="classroom" required onChange={ e => this.getClassroom(e.target.value, "classroom2") }>
                                        <option disabled selected>Klicka här för att välja Klassrum</option>
                                        { this.classroom2Groups() }
                                    </select>
                                </label>
                            }

                            { this.state.type === "Lägg till"
                                ?
                                    Object.entries(this.state.device).length > 0
                                    ?
                                    <table className="results">
                                        <thead>
                                            <tr>
                                                <th>Kategori</th>
                                                <th>Märke</th>
                                                <th>Model</th>
                                                <th>Serial Nummer</th>
                                                <th>Pris</th>
                                                <th>Länk URL</th>
                                                <th>Info</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr key={ `availableDevice-${this.state.device.id}` }>
                                                <td>{ this.state.device.category }</td>
                                                <td>{ this.state.device.brand }</td>
                                                <td>{ this.state.device.model }</td>
                                                <td>{ this.state.device.serialnum }</td>
                                                <td>{ this.state.device.price }</td>
                                                <td>{ this.state.device.url }</td>
                                                <td>{ this.state.device.message }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    null
                                :
                                    Object.entries(this.state.classroom2).length > 0
                                    ?
                                    <table className="results">
                                        <thead>
                                            <tr>
                                                <th>Apparat</th>
                                                <th>Katagori</th>
                                                <th>Märke</th>
                                                <th>Model</th>
                                                <th>Info</th>
                                                <th>Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.state.classroom2DevicesRows }
                                        </tbody>
                                    </table>
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
                </div>
            </div>
        );
    }
}

export default withRouter(ClassroomDeviceCreate);
