/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ReportList from './ReportList.js';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import '../Report.css';

class ReportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälning",
            id: this.props.location.state.id,
            report: {},
            item: {},
            itemTable: {
                body: []
            },
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
        this.loadReport();
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    loadReport() {
        let res = db.fetchWhere("report", "report.id", this.state.id);

        res.then((data) => {
            this.setState({
                report: data,
                reportList: <ReportList onRef={ref => (this.list = ref)} id={ data.id } itemGroup={ data.item_group } itemid={ data.item_id } />
            }, () => this.loadItem());
        });
    }

    loadItem() {
        let itemGroup = this.state.report.item_group;
        let res;

        switch(true) {
            case (itemGroup === "classroom"):
                res = db.fetchWhere("classroom", "id", this.state.report.classroom_id);
                break;
            case (itemGroup === "device"):
                res = db.fetchWhere("device", "id", this.state.report.device_id);
                break;
        }

        if (res) {
            res.then((data) => {
                this.setState({
                    item: data
                }, () => this.getItem());
            });
        }
    }

    getItem() {
        let item = this.state.item;
        let itemGroup = this.state.report.item_group;
        let data,
            selection,
            view,
            reportList,
            reportStatus,
            actions;

        switch(true) {
            case (itemGroup === "classroom"):
                selection = this.state.classroomSelection;
                view = () => utils.redirect(this, "/classroom", { id: item.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: item.id });
                reportStatus = db.reportCheck("classroom", item.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        itemTable: {
                            body: table.classroomBody(item, selection, actions)
                        }
                    });
                });
                break;
            case (itemGroup === "device"):
                selection = this.state.deviceSelection;
                view = () => utils.redirect(this, "/device", { id: item.id });
                reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: item.id });
                reportStatus = db.reportCheck("device", item.id);

                reportStatus.then((status) => {
                    actions = [
                        icon.reportStatus(reportList, status),
                        icon.get("View", view)
                    ];

                    this.setState({
                        itemTable: {
                            body: table.deviceBody(item, selection, actions)
                        }
                    });
                });
                break;
        }
    }

    render() {
        return (
            <div className="main-column">
                <div className="column-heading">
                    <h1>{ this.state.title }</h1>
                </div>
                <article>
                    {
                        Object.entries(this.state.report).length > 0
                            ?
                            <div>
                                <table className="results-card single-card">
                                    <tbody>
                                        { this.state.itemTable.body }
                                    </tbody>
                                </table>

                                <h2 className="center margin">
                                    { icon.get("Maintenance") }<br />
                                    Rapport
                                </h2>

                                <table className="results-alt">
                                    <tr>
                                        <th>Titel</th>
                                        <td>{ this.state.report.name }</td>
                                    </tr>
                                    <tr>
                                        <th>Vad</th>
                                        <td>{ this.state.report.device_id ? this.state.report.device_brand + " " + this.state.report.device_model : "Allmänt" }</td>
                                    </tr>
                                    <tr>
                                        <th>Meddeland</th>
                                        <td>{ this.state.report.message }</td>
                                    </tr>
                                    <tr>
                                        <th>Åtgärdning</th>
                                        <td>{ this.state.report.action || "-" }</td>
                                    </tr>
                                    <tr>
                                        <th>Åtgärdat</th>
                                        <td>{ this.state.report.solved ? utils.convertSqlDate(this.state.report.solved) : "-" }</td>
                                    </tr>
                                    <tr>
                                        <th>Skapad</th>
                                        <td>{ this.state.report.created ? utils.convertSqlDate(this.state.report.created) : "-" }</td>
                                    </tr>
                                </table>
                            </div>
                            :
                            null
                    }
                </article>
                { this.state.reportList }
            </div>
        );
    }
}

export default withRouter(ReportPage);
