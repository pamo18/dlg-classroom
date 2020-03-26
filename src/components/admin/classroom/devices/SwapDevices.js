/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Link } from 'react-router-dom';
import db from '../../../../models/db.js';
import utils from '../../../../models/utils.js';
import form from '../../../../models/form.js';
import table from '../../../../models/table.js';
import icon from '../../../../models/icon.js';
import '../../Admin.css';

class SwapDevices extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.loadClassroomDevices = this.loadClassroomDevices.bind(this);
        this.getClassroomDevices = this.getClassroomDevices.bind(this);
        this.classroom1Handler = this.classroom1Handler.bind(this);
        this.classroom2Handler = this.classroom2Handler.bind(this);
        this.swapDevice = this.swapDevice.bind(this);
        this.removeDevice = this.removeDevice.bind(this);
        this.reload = this.reload.bind(this);
        this.state = {
            title: "Byta utrustning i ett klassrum",
            classroomNameTemplate: "name",
            deviceNameTemplate: "brand,model,(serialnum)",
            classroomData: [],
            classroomGroups: {},
            classroom1: {},
            classroom1Selected: null,
            classroom1Devices: [],
            classroom1DevicesTable: {},
            classroom1DevicesCount: null,
            classroom2: {},
            classroom2Selected: null,
            classroom2Devices: [],
            classroom2DevicesTable: {},
            classroom2DevicesCount: null
        };
    }

    componentDidMount() {
        let state = this.props.restore("managerState");

        if (state) {
            this.setState(state, () => {
                if (this.state.classroom1.hasOwnProperty("id")) {
                    this.reload();
                }
            });
        } else {
            this.loadClassrooms();
        }
    }

    componentWillUnmount() {
        this.props.save("managerState", this.state);
    }

    // Load Classrooms and group data - Step 1
    loadClassrooms() {
        let res = db.fetchAll("classroom");

        res.then((data) => {
            let organize = form.organize(data, "location", "id");
            let classroomData = organize.data;
            let classroomGroups = organize.groups;
            let classroom1Groups = this.getClassroom1Groups(classroomGroups);

            this.setState({
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

        let template = this.state.classroomNameTemplate;
        let classroom2 = this.state.classroom2Selected;

        let selected = (id) => {
            return this.state.classroom1Selected == id ? "selected" : null;
        };

        let groups = form.group(data, "id", template, selected, classroom2);

        return groups;
    }

    // Load Classrooms2 form groups - Step 3 optional - Get Formdata
    getClassroom2Groups(data = null) {
        if (!data) {
            data = this.state.classroomGroups;
        }

        let template = this.state.classroomNameTemplate;
        let classroom1 = this.state.classroom1Selected;

        let selected = (id) => {
            return this.state.classroom2Selected == id ? "selected" : null;
        };

        let groups = form.group(data, "id", template, selected, classroom1);

        return groups;
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
        let res = db.fetchAllWhere("classroom/device", "classroom_id", id);

        res.then((data) => {
            this.setState({
                [`${classroom}Devices`]: data
            }, () => this.getClassroomDevices(classroom));
        });
    }

    // Get classroom - Step 3 - Build classroom devices table rows
    getClassroomDevices(classroom) {
        let count = 0;
        let classroomDevices = `${classroom}Devices`;
        let classroomid = this.state[classroom].id;

        let classroomDevicesRows = this.state[classroomDevices].map((device) => {
            let swap;
            let down = () => this.swapDevice(this.state.classroom1.id, this.state.classroom2.id, device.id);
            let up = () => this.swapDevice(this.state.classroom2.id, this.state.classroom1.id, device.id);
            let view = () => utils.redirect(this, "/device", {id: device.id});
            let del = () => this.removeDevice(classroomid, device.id);

            count++;

            if (classroom === "classroom1") {
                swap = icon.get("Down", down);
            } else if (classroom === "classroom2") {
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

    classroom1Handler(e) {
        this.getClassroom(e.target.value, "classroom1");
    }

    classroom2Handler(e) {
        this.getClassroom(e.target.value, "classroom2");
    }

    // Reload classrooms, devices and classroom devices to update any changes
    reload() {
        let classroom1 = this.state.classroom1.id;
        let classroom2 = this.state.classroom2.id;

        this.loadClassrooms();
        this.getClassroom(classroom1, "classroom1");
        this.getClassroom(classroom2, "classroom2");
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form className="form-register">
                    <label className="form-label">Välj klassrum 1
                        <select className="form-input" type="text" name="classroom" required onChange={ this.classroom1Handler }>
                            <option disabled selected>Klicka här för att välja Klassrum</option>
                            { this.getClassroom1Groups() }
                        </select>
                    </label>

                    {
                        Object.entries(this.state.classroom1).length > 0
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

                    <label className="form-label">Välj klassrum 2
                        <select className="form-input" type="text" name="classroom" required onChange={ this.classroom2Handler }>
                            <option disabled selected>Klicka här för att välja Klassrum</option>
                            { this.getClassroom2Groups() }
                        </select>
                    </label>

                    {
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
                </form>
            </article>
        );
    }
}

export default withRouter(SwapDevices);
