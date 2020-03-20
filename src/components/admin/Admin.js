/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import icon from '../../models/icon.js';
import './Admin.css';
import image from "../../assets/classroom/default.jpg";
import ClassroomCreate from './classroom/ClassroomCreate.js';
import ClassroomUpdate from './classroom/ClassroomUpdate.js';
import ClassroomDelete from './classroom/ClassroomDelete.js';
import DeviceCreate from './device/DeviceCreate.js';
import DeviceUpdate from './device/DeviceUpdate.js';
import DeviceDelete from './device/DeviceDelete.js';
import ClassroomManager from './classroom/manager/ClassroomManager.js';
import AddDevices from './classroom/manager/AddDevices.js';
import SwapDevices from './classroom/manager/SwapDevices.js';
import Devices from './device/view/Devices.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.getControls = this.getControls.bind(this);
        this.change = this.change.bind(this);
        this.classroomView = this.classroomView.bind(this);
        this.deviceView = this.deviceView.bind(this);
        this.classroomDeviceView = this.classroomDeviceView.bind(this);
        this.state = {
            title: "Admin",
            image: image,
            view: null,
            control: {
                classroom: [],
                device: [],
                classroomDevice: []
            }
        };
    }

    componentDidMount () {
        let state = this.props.restore("adminState");

        if (state) {
            this.setState(state);
        }

        this.getControls();
    }

    componentWillUnmount() {
        this.props.save("adminState", this.state);
    }

    async getControls() {
        this.setState({
            control: {
                classroom: this.classroomControl(),
                device: this.deviceControl(),
                classroomDevice: this.classroomDeviceControl()
            }
        })
    }

    classroomControl() {
        let view = () => this.classroomView("view");
        let add = () => this.classroomView("add");
        let edit = () => this.classroomView("edit");
        let del = () => this.classroomView("delete");

        let classroom = [
            <figure className="control-icon center">
                { icon.get("Classroom") }
                <figcaption>
                    <div>
                        { icon.get("View", view) }
                        { icon.get("Add", add) }
                        { icon.get("Edit", edit) }
                        { icon.get("Delete", del) }
                    </div>

                </figcaption>
            </figure>
        ];

        return classroom;
    }

    classroomView(admin) {
        let view;

        switch(true) {
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

        this.change(view);
    }

    deviceControl() {
        let view = () => this.deviceView("view");
        let add = () => this.deviceView("add");
        let edit = () => this.deviceView("edit");
        let del = () => this.deviceView("delete");

        let device = [
            <figure className="control-icon center">
                { icon.get("Device") }
                <figcaption>
                    <div>
                        { icon.get("View", view) }
                        { icon.get("Add", add) }
                        { icon.get("Edit", edit) }
                        { icon.get("Delete", del) }
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
                view = <Devices />;
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

        this.change(view);
    }

    classroomDeviceControl() {
        let add = () => this.classroomDeviceView("add");
        let swap = () => this.classroomDeviceView("swap");

        let classroomDevice = [
            <figure className="control-icon center">
                { icon.get("classroomDevice") }
                <figcaption>
                    <div>
                        { icon.get("Add", add) }
                        { icon.get("Swap", swap) }
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

        this.change(view);
    }

    change(view) {
        this.setState({
            view: view
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
                        <div className="admin-control">
                            <h2 className="center">Klassrum</h2>
                            <div className="admin-control">
                                { this.state.control.classroom }
                            </div>

                            <h2 className="center">Utrustning</h2>
                            <div className="admin-control">
                                { this.state.control.device }
                            </div>

                            <h2 className="center">Koppla</h2>
                            <div className="admin-control">
                                { this.state.control.classroomDevice }
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
