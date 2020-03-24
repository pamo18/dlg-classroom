/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import icon from '../../models/icon.js';
import './Admin.css';
import image from "../../assets/classroom/default.jpg";
import ClassroomView from './classroom/ClassroomView.js';
import ClassroomCreate from './classroom/ClassroomCreate.js';
import ClassroomUpdate from './classroom/ClassroomUpdate.js';
import ClassroomDelete from './classroom/ClassroomDelete.js';
import DeviceView from './device/DeviceView.js';
import DeviceCreate from './device/DeviceCreate.js';
import DeviceUpdate from './device/DeviceUpdate.js';
import DeviceDelete from './device/DeviceDelete.js';
import AddDevices from './classroom/devices/AddDevices.js';
import SwapDevices from './classroom/devices/SwapDevices.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.classroomView = this.classroomView.bind(this);
        this.deviceView = this.deviceView.bind(this);
        this.classroomDeviceView = this.classroomDeviceView.bind(this);
        this.change = this.change.bind(this);
        this.state = {
            title: "Admin",
            image: image,
            view: null,
            control: {
                classroom: [],
                device: [],
                classroomDevice: []
            },
            selected: ""
        };
    }

    componentDidMount () {
        let state = this.props.restore("adminState");

        if (state) {
            this.setState(state);
        }
    }

    componentWillUnmount() {
        this.props.save("adminState", this.state);
    }

    classroomControl() {
        let view = () => this.classroomView("view");
        let add = () => this.classroomView("add");
        let edit = () => this.classroomView("edit");
        let del = () => this.classroomView("delete");
        let selected = this.state.selected;

        let classroom = [
            <figure className="control-icon center">
                { icon.get("Classroom") }
                <figcaption>
                    <div>
                        { icon.get("View", view, selected === "classroom-view") }
                        { icon.get("Add", add, selected === "classroom-add") }
                        { icon.get("Edit", edit, selected === "classroom-edit") }
                        { icon.get("Delete", del, selected === "classroom-delete") }
                    </div>

                </figcaption>
            </figure>
        ];

        return classroom;
    }

    classroomView(admin) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <ClassroomView />;
                break;
            case (admin === "add"):
                view = <ClassroomCreate />;
                break;
            case (admin === "edit"):
                view = <ClassroomUpdate />;
                break;
            case (admin === "delete"):
                view = <ClassroomDelete />;
                break;
        }

        this.change(view, `classroom-${admin}`);
    }

    deviceControl() {
        let view = () => this.deviceView("view");
        let add = () => this.deviceView("add");
        let edit = () => this.deviceView("edit");
        let del = () => this.deviceView("delete");
        let selected = this.state.selected;

        let device = [
            <figure className="control-icon center">
                { icon.get("Device") }
                <figcaption>
                    <div>
                        { icon.get("View", view, selected === "device-view") }
                        { icon.get("Add", add, selected === "device-add") }
                        { icon.get("Edit", edit, selected === "device-edit") }
                        { icon.get("Delete", del, selected === "device-delete") }
                    </div>

                </figcaption>
            </figure>
        ];

        return device;
    }

    deviceView(admin) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <DeviceView />;
                break;
            case (admin === "add"):
                view = <DeviceCreate />;
                break;
            case (admin === "edit"):
                view = <DeviceUpdate />;
                break;
            case (admin === "delete"):
                view = <DeviceDelete />;
                break;
        }

        this.change(view, `device-${admin}`);
    }

    classroomDeviceControl() {
        let add = () => this.classroomDeviceView("add");
        let swap = () => this.classroomDeviceView("swap");
        let selected = this.state.selected;

        let classroomDevice = [
            <figure className="control-icon center">
                { icon.get("classroomDevice") }
                <figcaption>
                    <div>
                        { icon.get("Add", add, selected === "classroom-device-add") }
                        { icon.get("Swap", swap, selected === "classroom-device-swap") }
                    </div>
                </figcaption>
            </figure>
        ];

        return classroomDevice;
    }

    classroomDeviceView(admin) {
        let view;

        switch(true) {
            case (admin === "add"):
                view = <AddDevices save={this.props.save} restore={this.props.restore} />;
                break;
            case (admin === "swap"):
                view = <SwapDevices save={this.props.save} restore={this.props.restore} />;
                break;
        }

        this.change(view, `classroom-device-${admin}`);
    }

    change(view, selected = "") {
        this.setState({
            view: view,
            selected: selected
        });
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <div className="left-column">
                        <div className="admin-panel">
                            <div className="admin-control">
                                <h2 className="center">Klassrum</h2>
                                { this.classroomControl() }
                            </div>

                            <div className="admin-control">
                                <h2 className="center">Utrustning</h2>
                                { this.deviceControl() }
                            </div>

                            <div className="admin-control">
                                <h2 className="center">Koppla</h2>
                                { this.classroomDeviceControl() }
                            </div>
                        </div>
                    </div>
                    <div className="main-column">
                        <div className="admin-view">
                            { this.state.view
                                ?
                                this.state.view
                                :
                                <div>
                                    <h2 className="center margin">DLG</h2>
                                    <div className="classroom-image">
                                        <img src={ this.state.image } alt="Classroom image"/>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default withRouter(Admin);
