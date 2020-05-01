/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../../models/db.js';
import form from '../../../../models/form.js';
import '../../Admin.css';
import DeviceCards from '../../../device/DeviceCards.js';

class SwapDevices extends Component {
    constructor(props) {
        super(props);
        this.swap = this.swap.bind(this);
        this.classroom1Handler = this.classroom1Handler.bind(this);
        this.classroom2Handler = this.classroom2Handler.bind(this);
        this.state = {
            title: "Byta utrustning mellan klassrum",
            classroomNameTemplate: "name",
            deviceNameTemplate: "brand,model,(serialnum)",
            classroomData: [],
            classroomGroups: {},
            classroom1: {},
            classroom1Selected: null,
            classroom1Devices: [],
            classroom1DevicesCount: null,
            classroom2: {},
            classroom2Selected: null,
            classroom2Devices: [],
            selection : [
                ["category-caption-advanced", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        this.loadClassrooms();
    }

    // Load Classrooms and group data - Step 1
    loadClassrooms() {
        let res = db.fetchAll("classroom");

        res.then((data) => {
            let organize = form.organize(data, "building", "id");
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
            let classroomData = this.state.classroomData[id];

            this.setState({
                [classroom]: classroomData,
                [`${classroom}Selected`]: classroomData.id
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
            }, () => this[`${classroom}Devices`].updateData(data));
        });
    }

    swap(deviceid, direction) {
        let id1 = this.state.classroom1.id;
        let id2 = this.state.classroom2.id;
        let classroomTo = (direction === "up") ? id1 : id2;
        let classroomDevice = {
            classroom_id: classroomTo
        };

        let res = db.update("device", deviceid, classroomDevice);

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
                            <h3 class="center">{ `Antal utrustning: ${ this.state.classroom1Devices.length }` }</h3>
                            <DeviceCards
                                onRef={ref => (this.classroom1Devices = ref)}
                                devices={ this.state.classroom1Devices }
                                choice={ ["status", "view", "down"] }
                                selection={ this.state.selection }
                                callbacks={ { "swap": this.swap } }
                            />
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
                            <h3 class="center">{ `Antal utrustning: ${ this.state.classroom2Devices.length }` }</h3>
                            <DeviceCards
                                onRef={ref => (this.classroom2Devices = ref)}
                                devices={ this.state.classroom2Devices }
                                choice={ ["status", "view", "up"] }
                                selection={ this.state.selection }
                                callbacks={ { "swap": this.swap } }
                            />
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
