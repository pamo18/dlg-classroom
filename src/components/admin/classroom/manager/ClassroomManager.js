/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Link } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import icon from '../../../../models/icon.js';
import '../../Admin.css';
import Clone from "lodash";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

class ClassroomManager extends Component {
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
        this.deviceHandler = this.deviceHandler.bind(this);
        this.classroom1Handler = this.classroom1Handler.bind(this);
        this.classroom2Handler = this.classroom2Handler.bind(this);
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
            classroom1DevicesCount: null,
            classroom2: {},
            classroom2Devices: [],
            classroom2DevicesRows: [],
            classroom2DevicesCount: null,
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

            count++;

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
                <tr key={ `${classroom}Device-${device.id}` } className="clickable" onClick={ () => utils.redirect(that, "/device", {id: device.id}) }>
                    <td data-title="Kategori">{ icon.get(device.category)}</td>
                    <td data-title="Märke">{ device.brand }</td>
                    <td data-title="Modell">{ device.model }</td>
                    <td data-title="Serial">{ device.serialnum }</td>
                    <td data-title="Pris">{ device.price }:-</td>
                    <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                    <td data-title="Admin">
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
            [`${classroom}DevicesRows`]: classroomDevicesRows,
            [`${classroom}DevicesCount`]: count
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

        this.loadClassrooms();
        this.loadDevices();
        this.getClassroom(classroom1, "classroom1");

        if (this.state.type === "Byta") {
            let classroom2 = this.state.classroom2.id;

            this.getClassroom(classroom2, "classroom2");
        }
    }

    // Change type, reset bottom options/table then update classroom1 options to include/exclude swap function
    changeType(e) {
        let type = e.target.value;

        if (type === "Lägg till") {
            this.setState({
                type: type,
                classroom2: {}
            }, () => this.getClassroomDevice("classroom1"));
        } else if (type === "Byta") {
            this.setState({
                type: type,
                device: {}
            }, () => this.getClassroomDevice("classroom1"));
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
                            { this.state.classroomGroups }
                        </select>
                    </label>

                    { Object.entries(this.state.classroom1).length > 0
                        ?
                        <div>
                            <h3 class="center">{ `Antal apparater: ${this.state.classroom1DevicesCount}` }</h3>
                            <table className={ this.state.type === "Lägg till" ? "results" : "results swap" }>
                                <thead>
                                    <tr>
                                        <th>Kategori</th>
                                        <th>Märke</th>
                                        <th>Modell</th>
                                        <th>Serial Nummer</th>
                                        <th>Pris</th>
                                        <th>Länk URL</th>
                                        <th>Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.classroom1DevicesRows }
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
                                { this.classroom2Groups() }
                            </select>
                        </label>
                    }

                    { this.state.type === "Lägg till"
                        ?
                            Object.entries(this.state.device).length > 0
                            ?
                            <table className="results add">
                                <thead>
                                    <tr>
                                        <th>Kategori</th>
                                        <th>Märke</th>
                                        <th>Modell</th>
                                        <th>Serial Nummer</th>
                                        <th>Pris</th>
                                        <th>Länk URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={ `availableDevice-${this.state.device.id}` } className="clickable" onClick={ () => utils.redirect(this, "/device", {id: this.state.device.id}) }>
                                        <td data-title="Kategori">{ icon.get(this.state.device.category)}</td>
                                        <td data-title="Märke">{ this.state.device.brand }</td>
                                        <td data-title="Modell">{ this.state.device.model }</td>
                                        <td data-title="Serial Nummer">{ this.state.device.serialnum }</td>
                                        <td data-title="Pris">{ this.state.device.price }:-</td>
                                        <td data-title="Länk URL"><a href={ this.state.device.url } target="_blank">Till produktsida</a></td>
                                    </tr>
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
                                        <tr>
                                            <th>Kategori</th>
                                            <th>Märke</th>
                                            <th>Modell</th>
                                            <th>Serial Nummer</th>
                                            <th>Pris</th>
                                            <th>Länk URL</th>
                                            <th>Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.classroom2DevicesRows }
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
