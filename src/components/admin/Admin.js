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
import ReportView from './report/ReportView.js';
import ReportUpdate from './report/ReportUpdate.js';
import ReportDelete from './report/ReportDelete.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.adminView = this.adminView.bind(this);
        this.classroomView = this.classroomView.bind(this);
        this.deviceView = this.deviceView.bind(this);
        this.classroomDeviceView = this.classroomDeviceView.bind(this);
        this.reportView = this.reportView.bind(this);
        this.change = this.change.bind(this);
        this.state = {
            title: "Admin",
            image: image,
            view: null,
            selected: "",
            admin: ""
        };
    }

    componentDidMount () {
        let state = this.props.restore("adminState");

        if (state) {
            this.setState(state, () => this.adminView(this.state.selected, this.state.admin));
        }
    }

    adminView(selected, admin) {
        switch(true) {
            case (selected === "classroom"):
                this.classroomView(admin);
                break;
            case (selected === "device"):
                this.deviceView(admin);
                break;
            case (selected === "classroom-device"):
                this.classroomDeviceView(admin);
                break;
            case (selected === "report"):
                this.reportView(admin);
                break;
            }
    }

    componentWillUnmount() {
        this.props.save("adminState", this.state);
    }

    classroomView(admin) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <ClassroomView save={this.props.save} restore={this.props.restore} />;
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

        this.change(view, "classroom", admin);
    }

    deviceView(admin) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <DeviceView save={this.props.save} restore={this.props.restore} />;
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

        this.change(view, "device", admin);
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

        this.change(view, "classroom-device", admin);
    }

    reportView(admin, id = null) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <ReportView admin={ this.reportView } save={this.props.save} restore={this.props.restore } />;
                break;
            case (admin === "edit"):
                view = <ReportUpdate id={id} />;
                break;
            case (admin === "delete"):
                view = <ReportDelete id={id} />;
                break;
        }

        this.change(view, "report", admin);
    }

    change(view, selected, admin) {
        this.setState({
            view: view,
            selected: selected,
            admin: admin
        });
    }

    render() {
        let selected = this.state.selected;
        let admin = this.state.admin;
        return (
            <main>
                <div className="left-column">
                    <div className="column-heading">
                        <h2>Kontrollpanel</h2>
                    </div>
                    <aside className="admin-panel">
                        <div className="admin-control">
                            <figure className="admin-group">
                                <h2 className="center">Klassrum</h2>
                                { icon.get("Classroom") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { this.classroomView("view") }, selected === "classroom" && admin === "view") }
                                        { icon.get("Add", () => { this.classroomView("add") }, selected === "classroom" && admin === "add") }
                                        { icon.get("Edit", () => { this.classroomView("edit") }, selected === "classroom" && admin === "edit") }
                                        { icon.get("Delete", () => { this.classroomView("delete") }, selected === "classroom" && admin === "delete") }
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className="admin-control">
                            <figure className="admin-group">
                                <h2 className="center">Utrustning</h2>
                                { icon.get("Device") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { this.deviceView("view") }, selected === "device" && admin === "view") }
                                        { icon.get("Add", () => { this.deviceView("add") }, selected === "device" && admin === "add") }
                                        { icon.get("Edit", () => { this.deviceView("edit") }, selected === "device" && admin === "edit") }
                                        { icon.get("Delete", () => { this.deviceView("delete") }, selected === "device" && admin === "delete") }
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className="admin-control">
                            <figure className="admin-group">
                                <h2 className="center">Koppla</h2>
                                { icon.get("classroomDevice") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("Add", () => { this.classroomDeviceView("add") }, selected === "classroom-device" && admin === "add") }
                                        { icon.get("Swap", () => { this.classroomDeviceView("swap") }, selected === "classroom-device" && admin === "swap") }
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className="admin-control">
                            <figure className="admin-group">
                                <h2 className="center">Felanmälningar</h2>
                                { icon.get("Message") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { this.reportView("view") }, selected === "report" && admin === "view") }
                                        { icon.get("Edit", () => { this.reportView("edit") }, selected === "report" && admin === "edit") }
                                        { icon.get("Delete", () => { this.reportView("delete") }, selected === "report" && admin === "delete") }
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </aside>
                </div>

                <div className="main-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    { this.state.view
                        ?
                        this.state.view
                        :
                        <article>
                            <h2 className="center margin">DLG</h2>
                            <div className="admin-default-image">
                                <img src={ this.state.image } alt="Classroom image"/>
                            </div>
                        </article>
                    }
                </div>
            </main>
        );
    }
}

export default withRouter(Admin);
