/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import '../../Admin.css';

class ClassroomDeviceCreate extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.getDevice = this.getDevice.bind(this);
        this.loadClassroomDevices = this.loadClassroomDevices.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.state = {
            title: "Ny Klassrum apparat",
            classroomData: [],
            deviceData: [],
            classroomGroups: [],
            deviceGroups: [],
            classroomNameTemplate: "name",
            deviceNameTemplate: "brand,model,(serialnum)",
            classroom: {},
            device: {},
            classroomDevices: [],

        };
    }

    componentDidMount() {
        this.loadClassrooms();
        this.loadDevices();
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let formData = form.group(data, "location", "id", that.state.classroomNameTemplate);

            that.setState({
                classroomData: formData.data,
                classroomGroups: formData.groups
            });
        });
    }

    loadDevices() {
        let that = this;
        let allData = {};
        let groups = {};
        let res = db.fetchAll("device");

        res.then(function(data) {
            let formData = form.group(data, "category", "id", that.state.deviceNameTemplate);

            that.setState({
                deviceData: formData.data,
                deviceGroups: formData.groups
            });
        });
    }

    getClassroom(e) {
        let id = e.target.value;

        try {
            let res = this.state.classroomData[id];

            this.setState({
                classroom: {
                    id: res.id,
                    name: res.name,
                    type: res.type,
                    location: res.location,
                    level: res.level,
                    image: res.image
                }
            }, () => this.loadClassroomDevices(id));
        } catch(err) {
            console.log(err);
        }
    }

    getDevice(e) {
        let id = e.target.value;

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

    loadClassroomDevices(id) {
        let that = this;
        let res = db.fetchAllWhere("classroom/device", id);

        res.then(function(data) {
            that.setState({
                classroomDevices: data
            });
        });
    }

    addDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let classroomDevice = {
            device_id: data.get("classroomid"),
            classroom_id: data.get("deviceid")
        };

        let res = db.insert("classroom/device", classroomDevice);

        res.then(utils.reload(this, "/"));
    }

    render() {
        let count = 0;
        return (
            <div className="double-column">
                <div className="admin-column">
                    <div className="form-wrapper">
                        <h2 className="center">Lätt till apparater i ett klassrum</h2>
                        <form action="/" className="form-register" onSubmit={ this.addDevice }>
                            <input className="form-input" type="hidden" name="classroomid" required value={ this.state.classroom.id } />
                            <input className="form-input" type="hidden" name="deviceid" required value={ this.state.device.id } />

                            <label className="form-label">Välj klassrum
                                <select className="form-input" type="text" name="classroom" required onChange={ this.getClassroom }>
                                    <option disabled selected>Klicka här för att välja Klassrum</option>
                                    { this.state.classroomGroups }
                                </select>
                            </label>
                            { Object.entries(this.state.classroom).length > 0
                            ?
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
                                        this.state.classroomDevices.map(function(device) {
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
                            : null
                            }

                            <label className="form-label">Välj apparat
                                <select className="form-input" type="text" name="device" required onChange={ this.getDevice }>
                                    <option disabled selected>Klicka här för att välja apparat</option>
                                    { this.state.deviceGroups }
                                </select>
                            </label>

                            { Object.entries(this.state.device).length > 0
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
                                        <tr key={ this.state.device.id }>
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
                            }
                            { Object.entries(this.state.classroom).length > 0 && Object.entries(this.state.device).length > 0
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
