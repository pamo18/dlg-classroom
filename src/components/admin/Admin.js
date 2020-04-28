/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  {  withRouter } from 'react-router-dom';
import utils from '../../models/utils.js';
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
import PersonDelete from './person/PersonDelete.js';
import PersonLevel from './person/PersonLevel.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.adminView = this.adminView.bind(this);
        this.classroomView = this.classroomView.bind(this);
        this.deviceView = this.deviceView.bind(this);
        this.classroomDeviceView = this.classroomDeviceView.bind(this);
        this.reportView = this.reportView.bind(this);
        this.change = this.change.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {
            title: "Admin",
            toggle: {
                classroom: "close",
                device: "close",
                classroomDevice: "close",
                report: "close",
                person: "close"
            },
            image: image,
            view: null,
            selected: this.props.match.params.selected || "",
            admin: this.props.match.params.admin || "",
            id: this.props.match.params.id || null,
            tooltip: null
        };
    }

    componentDidMount () {
        let state = this.props.restore("adminState");
        let selected = this.state.selected;
        let admin = this.state.admin;
        let id = this.state.id;

        if (selected && admin) {
            this.adminView(selected, admin, id)
        }
        else if (state) {
            this.setState(state, () => {
                if (this.state.selected && this.state.admin && this.state.id) {
                    utils.redirect(this, `/admin/${ this.state.selected }/${ this.state.admin }/${ this.state.id }`);
                } else if (this.state.selected && this.state.admin) {
                    utils.redirect(this, `/admin/${ this.state.selected }/${ this.state.admin }`);
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        try {
            let selected = this.props.match.params.selected;
            let admin = this.props.match.params.admin;
            let id = this.props.match.params.id || null;

            if (prevProps.match.params != this.props.match.params) {
                this.adminView(selected, admin, id);
            }
        } catch(err) {
            console.log(err)
        };
    }

    componentWillUnmount() {
        this.props.save("adminState", this.state);
        window.scrollTo(0, 0);
    }

    adminView(selected, admin, id = null) {
        switch(true) {
            case (selected === "classroom"):
                this.classroomView(admin, id);
                break;
            case (selected === "device"):
                this.deviceView(admin, id);
                break;
            case (selected === "classroom-device"):
                this.classroomDeviceView(admin, id);
                break;
            case (selected === "report"):
                this.reportView(admin, id);
                break;
            case (selected === "person"):
                this.personView(admin, id);
                break;
            default:
                return;
            }
    }

    classroomView(admin, id = null) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <ClassroomView save={this.props.save} restore={this.props.restore} />;
                break;
            case (admin === "add"):
                view = <ClassroomCreate />;
                break;
            case (admin === "edit"):
                view = <ClassroomUpdate id={id} />;
                break;
            case (admin === "delete"):
                view = <ClassroomDelete id={id} />;
                break;
            default:
                return;
        }

        this.change(view, "classroom", admin, id);
    }

    deviceView(admin, id = null) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <DeviceView save={this.props.save} restore={this.props.restore} />;
                break;
            case (admin === "add"):
                view = <DeviceCreate />;
                break;
            case (admin === "edit"):
                view = <DeviceUpdate id={id} />;
                break;
            case (admin === "delete"):
                view = <DeviceDelete id={id} />;
                break;
            default:
                return;
        }

        this.change(view, "device", admin, id);
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
            default:
                return;
        }

        this.change(view, "classroom-device", admin);
    }

    reportView(admin, id = null) {
        let view;

        switch(true) {
            case (admin === "view"):
                view = <ReportView save={this.props.save} restore={this.props.restore } />;
                break;
            case (admin === "edit"):
                view = <ReportUpdate id={id} />;
                break;
            case (admin === "delete"):
                view = <ReportDelete id={id} />;
                break;
            default:
                return;
        }

        this.change(view, "report", admin, id);
    }

    personView(admin, id = null) {
        let view;

        switch(true) {
            case (admin === "delete"):
                view = <PersonDelete id={id} />;
                break;
            case (admin === "level"):
                view = <PersonLevel id={id} />;
                break;
            default:
                return;
        }

        this.change(view, "person", admin, id);
    }

    change(view, selected, admin, id = null) {
        let title = "Admin";

        switch(true) {
            case (selected === "classroom"):
                title = "Admin Klassrum";
                break;
            case (selected === "device"):
                title = "Admin Utrustning";
                break;
            case (selected === "classroom-device"):
                title = "Admin Koppla";
                break;
            case (selected === "report"):
                title = "Admin Felanmälningar";
                break;
            case (selected === "person"):
                title = "Admin Personer";
                break;
            default:
                return;
            }

        this.setState({
            title: title,
            view: view,
            selected: selected,
            admin: admin,
            id: id
        }, () => this.scroll());
    }

    scroll() {
        if (this.ref.current && this.state.selected) {
            this.ref.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            })
        }
    }

    toggleFilter(selected) {
        let toggle = this.state.toggle;

        toggle[selected] = toggle[selected] === "close" ? "open" : "close"

        this.setState({
            toggle: toggle
        });
    }

    toggleHover(tooltip) {
        this.setState({
            tooltip: tooltip
        })
    }

    render() {
        let selected = this.state.selected;
        let admin = this.state.admin;
        return (
            <main>
                <div className="left-column">
                    <div className="column-heading left-heading">
                        <h2>Adminkontroll</h2>
                    </div>
                    <aside className="panel admin-panel">
                        <div className={`controller ${ this.state.toggle.classroom }`}>
                            <figure className="control-group">
                                <h2 className="center">Klassrum</h2>
                                <div className="dropdown mobile-only">
                                    { icon.get(this.state.toggle.classroom === "close" ? "Drop-down" : "Drop-up", () => this.toggleFilter("classroom")) }
                                </div>
                                { icon.get("Classroom") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { utils.redirect(this, "/admin/classroom/view") }, selected === "classroom" && admin === "view", this.toggleHover, "Classrooms") }
                                        { icon.get("Add", () => { utils.redirect(this, "/admin/classroom/add") }, selected === "classroom" && admin === "add", this.toggleHover, "Classrooms") }
                                        { icon.get("Edit", () => { utils.redirect(this, "/admin/classroom/edit") }, selected === "classroom" && admin === "edit", this.toggleHover, "Classrooms") }
                                        { icon.get("Delete", () => { utils.redirect(this, "/admin/classroom/delete") }, selected === "classroom" && admin === "delete", this.toggleHover, "Classrooms") }
                                    </div>
                                </figcaption>
                                <div className="tooltip">
                                    <div className="tooltip-text">{ this.state.tooltip ?? <span className="tooltip-placeholder">Välj verktyg ovan</span> }</div>
                                </div>
                            </figure>
                        </div>

                        <div className={`controller ${ this.state.toggle.device }`}>
                            <figure className="control-group">
                                <h2 className="center">Utrustning</h2>
                                <div className="dropdown mobile-only">
                                    { icon.get(this.state.toggle.device === "close" ? "Drop-down" : "Drop-up", () => this.toggleFilter("device")) }
                                </div>
                                { icon.get("Device") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { utils.redirect(this, "/admin/device/view") }, selected === "device" && admin === "view", this.toggleHover, "Devices") }
                                        { icon.get("Add", () => { utils.redirect(this, "/admin/device/add") }, selected === "device" && admin === "add", this.toggleHover, "Devices") }
                                        { icon.get("Edit", () => { utils.redirect(this, "/admin/device/edit") }, selected === "device" && admin === "edit", this.toggleHover, "Devices") }
                                        { icon.get("Delete", () => { utils.redirect(this, "/admin/device/delete") }, selected === "device" && admin === "delete", this.toggleHover, "Devices") }
                                    </div>
                                    <div className="tooltip">
                                        <div className="tooltip-text">{ this.state.tooltip ?? <span className="tooltip-placeholder">Välj verktyg ovan</span> }</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className={`controller ${ this.state.toggle.classroomDevice }`}>
                            <figure className="control-group">
                                <h2 className="center">Koppla</h2>
                                <div className="dropdown mobile-only">
                                    { icon.get(this.state.toggle.classroomDevice === "close" ? "Drop-down" : "Drop-up", () => this.toggleFilter("classroomDevice")) }
                                </div>
                                { icon.get("classroomDevice") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("Add", () => { utils.redirect(this, "/admin/classroom-device/add") }, selected === "classroom-device" && admin === "add", this.toggleHover, "Connect") }
                                        { icon.get("Swap", () => { utils.redirect(this, "/admin/classroom-device/swap") }, selected === "classroom-device" && admin === "swap", this.toggleHover, "Connect") }
                                    </div>
                                    <div className="tooltip">
                                        <div className="tooltip-text">{ this.state.tooltip ?? <span className="tooltip-placeholder">Välj verktyg ovan</span> }</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className={`controller ${ this.state.toggle.report }`}>
                            <figure className="control-group">
                                <h2 className="center">Felanmälningar</h2>
                                <div className="dropdown mobile-only">
                                    { icon.get(this.state.toggle.report === "close" ? "Drop-down" : "Drop-up", () => this.toggleFilter("report")) }
                                </div>
                                { icon.get("Message") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("View", () => { utils.redirect(this, "/admin/report/view") }, selected === "report" && admin === "view", this.toggleHover, "Report") }
                                        { icon.get("Edit", () => { utils.redirect(this, "/admin/report/edit") }, selected === "report" && admin === "edit", this.toggleHover, "Report") }
                                        { icon.get("Delete", () => { utils.redirect(this, "/admin/report/delete") }, selected === "report" && admin === "delete", this.toggleHover, "Report") }
                                    </div>
                                    <div className="tooltip">
                                        <div className="tooltip-text">{ this.state.tooltip ?? <span className="tooltip-placeholder">Välj verktyg ovan</span> }</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>

                        <div className={`controller ${ this.state.toggle.person }`}>
                            <figure className="control-group">
                                <h2 className="center">Användare</h2>
                                <div className="dropdown mobile-only">
                                    { icon.get(this.state.toggle.person === "close" ? "Drop-down" : "Drop-up", () => this.toggleFilter("person")) }
                                </div>
                                { icon.get("User") }
                                <figcaption>
                                    <div className="control-icon">
                                        { icon.get("Delete", () => { utils.redirect(this, "/admin/person/delete") }, selected === "person" && admin === "delete", this.toggleHover, "Person") }
                                        { icon.get("Level", () => { utils.redirect(this, "/admin/person/level") }, selected === "person" && admin === "level", this.toggleHover, "Person") }
                                    </div>
                                    <div className="tooltip">
                                        <div className="tooltip-text">{ this.state.tooltip ?? <span className="tooltip-placeholder">Välj verktyg ovan</span> }</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </aside>
                </div>

                <div className="main-column">
                    <div className="column-heading main-heading">
                        <h1 ref={ this.ref }>{ this.state.title }</h1>
                    </div>
                    { this.state.view
                        ?
                        this.state.view
                        :
                        <article>
                            <h2 className="center margin">DLG</h2>
                            <div className="admin-default-image">
                                <img src={ this.state.image } alt="Classroom"/>
                            </div>
                        </article>
                    }
                </div>
            </main>
        );
    }
}

export default withRouter(Admin);
