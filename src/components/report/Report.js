/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ReportList from './view/ReportList.js';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import icon from '../../models/icon.js';
import image from '../../models/image.js';
import table from '../../models/table.js';
import './Report.css';

class Report extends Component {
    constructor(props) {
        super(props);
        this.reportItem = this.reportItem.bind(this);
        this.state = {
            title: "Felanmäla",
            reports: [],
            reportsTable: {},
            reportList: null,
            itemGroup: this.props.location.state.itemGroup,
            classroomData: this.props.location.state.classroomData || {},
            deviceData: this.props.location.state.deviceData || {},
            itemTable: {}
        };
    }

    componentDidMount() {
        this.getItem();
    }

    getItem() {
        let itemGroup = this.state.itemGroup;
        let classroomData = this.state.classroomData;
        let deviceData = this.state.deviceData;
        let data,
            key,
            view,
            actions;

        switch(true) {
            case (itemGroup === "classroom"):
                key = `report-classroom`;
                view = () => utils.redirect(this, "/classroom", { id: classroomData.id });
                actions = icon.get("View", view);

                this.setState({
                    reportList: <ReportList itemGroup={ itemGroup } itemid={ classroomData.id } />,
                    itemTable: {
                        head: table.userHeadClassroom(),
                        body: table.userRowClassroom(key, classroomData, actions)
                    }
                });
                break;

            case (itemGroup === "device"):
                key = `report-device`;
                view = () => utils.redirect(this, "/device", { id: deviceData.id });
                actions = icon.get("View", view);

                this.setState({
                    reportList: <ReportList itemGroup={ itemGroup } itemid={ deviceData.id } />,
                    itemTable: {
                        head: table.userHeadDevice(),
                        body: table.userRowDevice(key, deviceData, actions)
                    }
                });
                break;
        }
    }

    reportItem(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let itemGroup = this.state.itemGroup;
        let res;

        switch(true) {
            case (itemGroup === "classroom"):
                let classroom = {
                    name:  data.get("name"),
                    item_group: "classroom",
                    item_id: this.state.classroomData.id,
                    message: data.get("message")
                };

                res = db.insert("report", classroom);
                break;
            case (itemGroup === "device"):
                let device = {
                    name:  data.get("name"),
                    item_group: "device",
                    item_id: this.state.deviceData.id,
                    message: data.get("message")
                };

                res = db.insert("report", device);
                break;
        }

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <article>
                <h2 className="center">
                    { this.state.title }
                    <br />
                    { icon.get("Message") }
                </h2>

                <div className="report-image">
                    <img src={ image.get(this.props.location.state.image) } alt="Classroom image"/>
                </div>

                <h2 className="center">Felanmäla följande:</h2>

                <table className="results">
                    <thead>
                        { this.state.itemTable.head }
                    </thead>
                    <tbody>
                        { this.state.itemTable.body }
                    </tbody>
                </table>

                <form className="form-register" onSubmit={ this.reportItem }>
                    <label className="form-label">Titel
                        <input className="form-input" type="text" name="name" placeholder="Ett namn som förklare snabbt problemet." />
                    </label>

                    <label className="form-label">Meddelande
                        <textarea className="form-input" name="message" placeholder="Skriv något om problemet." />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Felanmäla" />
                </form>

                { this.state.reportList }

            </article>
        );
    }
}

export default withRouter(Report);
