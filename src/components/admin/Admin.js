/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import './Admin.css';
import image from "../../assets/classroom/default.jpg";
import ClassroomCreate from './classroom/ClassroomCreate.js';
import ClassroomUpdate from './classroom/ClassroomUpdate.js';
import ClassroomDelete from './classroom/ClassroomDelete.js';
import DeviceCreate from './device/DeviceCreate.js';
import DeviceUpdate from './device/DeviceUpdate.js';
import DeviceDelete from './device/DeviceDelete.js';
import ClassroomManager from './classroom/manager/ClassroomManager.js';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.changeType = this.changeType.bind(this);
        this.changeAdmin = this.changeAdmin.bind(this);
        this.changeManager = this.changeManager.bind(this);
        this.getForm = this.getForm.bind(this);
        this.getManager = this.getManager.bind(this);
        this.state = {
            title: "Admin",
            image: image,
            type: "",
            admin: "",
            manager: "",
            view: null,
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
        let type = e.target.value;
        let admin = this.state.admin;
        let formView = this.getForm(type, admin);

        this.setState({
            manager: "",
            view: formView,
            type: type
        });
    }

    changeAdmin(e) {
        let type = this.state.type;
        let admin = e.target.value;
        let formView = this.getForm(type, admin);

        this.setState({
            manager: "",
            view: formView,
            admin: admin
        });
    }

    changeManager(e) {
        let manager = e.target.value;
        let managerView = this.getManager(manager);

        this.setState({
            manager: manager,
            view: managerView,
            type: "",
            admin: ""
        });
    }

    getForm(type, admin) {
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
        }
    }

    getManager(manager) {
        switch(true) {
            case (manager == "classroomManager"):
                return <ClassroomManager />;
        }
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
                            <h2 className="center">Admin</h2>
                            <div className="admin-control">
                                <button className={this.state.type === "create" ? "toggle-button on" : "toggle-button"} type="button" value="create" onClick={ this.changeType }>Ny</button>
                                <button className={this.state.type === "update" ? "toggle-button on" : "toggle-button"} type="button" value="update" onClick={ this.changeType }>Redigera</button>
                                <button className={this.state.type === "delete" ? "toggle-button on" : "toggle-button"} type="button" value="delete" onClick={ this.changeType }>Radera</button>
                            </div>

                            <h2 className="center">Område</h2>
                            <div className="admin-control">
                                <button className={this.state.admin === "classroom" ? "toggle-button on" : "toggle-button"} type="button" value="classroom" onClick={ this.changeAdmin }>Klassrum</button>
                                <button className={this.state.admin === "device" ? "toggle-button on" : "toggle-button"} type="button" value="device" onClick={ this.changeAdmin }>Apparat</button>
                            </div>

                            <h2 className="center">Hantera</h2>
                            <div className="admin-control">
                                <button className={this.state.manager === "classroomManager" ? "toggle-button on" : "toggle-button"} type="button" value="classroomManager" onClick={ this.changeManager }>Klassrum</button>
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
