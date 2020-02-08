/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ClassroomCreate from './classroom/ClassroomCreate.js';
import ClassroomUpdate from './classroom/ClassroomUpdate.js';
import ClassroomDelete from './classroom/ClassroomDelete.js';
import DeviceCreate from './device/DeviceCreate.js';
// import auth from '../../models/auth.js';
import utils from '../../models/utils.js';
import db from '../../models/db.js';
import './Admin.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.changeAdmin = this.changeAdmin.bind(this);
        this.changeType = this.changeType.bind(this);
        this.getForm = this.getForm.bind(this);
        this.state = {
            title: "Admin",
            admin: null,
            type: "create",
            data: [],
            current: {},
            devices: [],
            allOptions: [],
            myOptions: []
        };
    }

    componentDidMount() {

    }

    changeAdmin(e) {
        this.setState({
            admin: e.target.value
        });
    }

    changeType(e) {
        this.setState({
            type: e.target.value
        });
    }

    getForm() {
        let choice = {
            admin: this.state.admin,
            type: this.state.type
        };

        if (choice.admin && choice.type) {
            console.log(choice);
            switch(true) {
                case (choice.admin == "classroom" && choice.type == "create"):
                    return <ClassroomCreate history={this.props.history}/>;
                case (choice.admin == "classroom" && choice.type == "update"):
                    return <ClassroomUpdate history={this.props.history}/>;
                case (choice.admin == "classroom" && choice.type == "delete"):
                    return <ClassroomDelete history={this.props.history}/>;
                case (choice.admin == "device" && choice.type == "create"):
                    return <DeviceCreate history={this.props.history}/>;
            }
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
                            <h2 className="center">Admin</h2>
                            <div className="admin-control">
                                <button className={this.state.admin === "classroom" ? "toggle-button on" : "toggle-button"} type="button" value="classroom" onClick={ this.changeAdmin }>Klassrum</button>
                                <button className={this.state.admin === "device" ? "toggle-button on" : "toggle-button"} type="button" value="device" onClick={ this.changeAdmin }>Enhet</button>
                            </div>
                            <h2 className="center">Typ</h2>
                            <div className="admin-control">
                                <button className={this.state.type === "create" ? "toggle-button on" : "toggle-button"} type="button" value="create" onClick={ this.changeType }>Skapa</button>
                                <button className={this.state.type === "update" ? "toggle-button on" : "toggle-button"} type="button" value="update" onClick={ this.changeType }>Redigera</button>
                                <button className={this.state.type === "delete" ? "toggle-button on" : "toggle-button"} type="button" value="delete" onClick={ this.changeType }>Radera</button>
                            </div>
                        </div>
                    </div>
                    <div className="double-column">
                        <div className="column-2">
                            { this.getForm() }
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default Admin;
