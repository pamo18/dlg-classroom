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
        this.formHandler = this.formHandler.bind(this);
        this.state = {
            title: "Felanmäla",
            name: "",
            message: "",
            reports: [],
            reloadList: false,
            reportsTable: {},
            reportList: null,
            itemGroup: this.props.location.state.itemGroup || "",
            classroomData: this.props.location.state.classroomData || {},
            deviceData: this.props.location.state.deviceData || {},
            itemTable: {},
            classroomSelection: [
                ["name-caption-large", null],
                ["manage", null]
            ],
            deviceSelection: [
                ["category-caption-large", null],
                ["manage", null]
            ]
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
            selection,
            view,
            reportList,
            reportStatus,
            actions;

        switch(true) {
            case (itemGroup === "classroom"):
                selection = this.state.classroomSelection;
                view = () => utils.redirect(this, "/classroom", { id: classroomData.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: classroomData.id });
                reportStatus = db.reportCheck("classroom", classroomData.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        reportList: <ReportList onRef={ref => (this.list = ref)} itemGroup={ itemGroup } itemid={ classroomData.id } />,
                        itemTable: {
                            body: table.classroomBody(classroomData, selection, actions)
                        }
                    });
                });
                break;
            case (itemGroup === "device"):
                selection = this.state.deviceSelection;
                view = () => utils.redirect(this, "/device", { id: deviceData.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: deviceData.id });
                reportStatus = db.reportCheck("device", deviceData.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        reportList: <ReportList onRef={ref => (this.list = ref)} itemGroup={ itemGroup } itemid={ deviceData.id } />,
                        itemTable: {
                            body: table.deviceBody(deviceData, selection, actions)
                        }
                    });
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
                res.then(() => {
                    this.list.loadReports("classroom", this.state.classroomData.id);
                    this.setState({
                        name: "",
                        message: ""
                    }, () => this.getItem());
                });
                break;
            case (itemGroup === "device"):
                let device = {
                    name:  data.get("name"),
                    item_group: "device",
                    item_id: this.state.deviceData.id,
                    message: data.get("message")
                };

                res = db.insert("report", device);
                res.then(() => {
                    this.list.loadReports("device", this.state.deviceData.id);
                    this.setState({
                        name: "",
                        message: ""
                    }, () => this.getItem());
                });
                break;
        }
    }

    formHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="main-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    <table className="results-home">
                        <tbody>
                            { this.state.itemTable.body }
                        </tbody>
                    </table>

                    <h2 className="center">
                        { icon.get("Message") }<br />
                        Formulär
                    </h2>

                    <form className="form-register" onSubmit={ this.reportItem }>
                        <label className="form-label">Titel
                            <input className="form-input" type="text" name="name" value={ this.state.name } onChange={ this.formHandler } required placeholder="Ett namn som förklare snabbt problemet." />
                        </label>

                        <label className="form-label">Meddelande
                            <textarea className="form-input" name="message" value={ this.state.message } onChange={ this.formHandler } required placeholder="Skriv något om problemet." />
                        </label>

                        <input className="button center-margin" type="submit" name="create" value="Felanmäla" />
                    </form>
                </article>
                { this.state.reportList }
            </div>
        );
    }
}

export default withRouter(Report);
