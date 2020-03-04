/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import './Admin.css';
import ClassroomCreate from './classroom/ClassroomCreate.js';
import ClassroomUpdate from './classroom/ClassroomUpdate.js';
import ClassroomDelete from './classroom/ClassroomDelete.js';
import DeviceCreate from './device/DeviceCreate.js';
import DeviceUpdate from './device/DeviceUpdate.js';
import DeviceDelete from './device/DeviceDelete.js';
import ClassroomDeviceCreate from './classroom/device/ClassroomDeviceCreate.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.changeType = this.changeType.bind(this);
        this.changeAdmin = this.changeAdmin.bind(this);
        this.getForm = this.getForm.bind(this);
        this.state = {
            title: "Admin",
            type: "create",
            admin: "classroom",
            data: [],
            current: {},
            devices: [],
            allOptions: [],
            myOptions: []
        };
    }

    componentDidMount () {
        if (this.props.location.state) {
            this.setState({
                type: this.props.location.state.type,
                admin: this.props.location.state.admin
            });

            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: {
                    type: "create",
                    admin: "classroom",
                }
            });
        }
    }

    changeType(e) {
        this.setState({
            type: e.target.value
        }, () => this.getForm());
    }

    changeAdmin(e) {
        this.setState({
            admin: e.target.value
        }, () => this.getForm());
    }

    getForm() {
        let type = this.state.type;
        let admin = this.state.admin;

        switch(true) {
            case (admin == "classroom" && type === "create"):
                return <ClassroomCreate />;
            case (admin == "classroom" && type === "update"):
                return <ClassroomUpdate />;
            case (admin == "classroom" && type === "delete"):
                return <ClassroomDelete />;
            case (admin == "device" && type === "create"):
                return <DeviceCreate />;
            case (admin == "device" && type === "update"):
                return <DeviceUpdate />;
            case (admin == "device" && type === "delete"):
                return <DeviceDelete />;
            case (admin == "classroom-device" && type === "create"):
                return <ClassroomDeviceCreate />;
        }
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>
                        { this.state.title }
                    </h1>
                </div>
                <article>
                    <div className="column">
                        <div className="column-1">
                            <h2 className="center">Välj Admin</h2>
                            <div className="admin-control">
                                <button className={this.state.type === "create" ? "toggle-button on" : "toggle-button"} type="button" value="create" onClick={ this.changeType }>Ny</button>
                                <button className={this.state.type === "update" ? "toggle-button on" : "toggle-button"} type="button" value="update" onClick={ this.changeType }>Redigera</button>
                                <button className={this.state.type === "delete" ? "toggle-button on" : "toggle-button"} type="button" value="delete" onClick={ this.changeType }>Radera</button>
                            </div>
                            <h2 className="center">Välj Grupp</h2>
                            <div className="admin-control">
                                <button className={this.state.admin === "classroom" ? "toggle-button on" : "toggle-button"} type="button" value="classroom" onClick={ this.changeAdmin }>Klassrum</button>
                                <button className={this.state.admin === "device" ? "toggle-button on" : "toggle-button"} type="button" value="device" onClick={ this.changeAdmin }>Apparat</button>
                                <button className={this.state.admin === "classroom-device" ? "toggle-button on" : "toggle-button"} type="button" value="classroom-device" onClick={ this.changeAdmin }>Klassrum Apparat</button>
                            </div>
                        </div>
                    </div>
                    { this.getForm() }
                </article>
            </main>
        );
    }
}

export default withRouter(Admin);
