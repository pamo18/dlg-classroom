/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ReportAdmin from './ReportAdmin';
import { AuthContext, AdminContext } from "../../auth/auth.js";
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import '../Report.css';

class ReportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälningar",
            reports: [],
            unsolvedTable: {
                head: [],
                body: []
            },
            solvedTable: {
                head: [],
                body: []
            },
            itemGroup: this.props.itemGroup || this.props.location.state.itemGroup,
            itemData: this.props.itemData || this.props.location.state.itemData,
            selection : [
               ["item-category", "10%"],
               ["title", "35%"],
               ["created", "20%"],
               ["solved", "20%"],
               ["manage", "25%"]
           ]
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        try {
            this.loadReports(this.state.itemGroup, this.state.itemData.id);
        } catch(err) {
            console.log(err);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }

        window.scrollTo(0, 0);
    }

    loadReports(itemGroup, id) {
        let res;
        let res2;
        let deviceRes;

        if (itemGroup === "classroom") {
            res = db.fetchAllWhere("report/classroom", "item_id", id);

            res.then((data) => {
                res2 = db.fetchAllWhere("classroom/device", "classroom_id", id);

                res2.then((data2) => {
                    data2.forEach((device) => {
                        deviceRes = db.fetchAllWhere("report/device", "item_id", device.id);

                        deviceRes.then((deviceData) => {
                            deviceData.forEach((deviceReport) => {
                                data.push(deviceReport);
                            });

                            this.setState({
                                reports: data
                            },() => this.getReports());
                        });
                    });
                });
            });
        } else {
            res = db.fetchAllWhere("report/device", "item_id", id);

            res.then((data) => {
                this.setState({
                    reports: data
                },() => this.getReports());
            });
        }
    }

    getReports() {
        let selection = this.state.selection;
        let unsolvedReports = this.state.reports.filter((report) => !report.solved);
        let solvedReports = this.state.reports.filter((report) => report.solved);
        let actions,
            view;

        let unsolvedReportRows = unsolvedReports.map((report) => {
            view = () => utils.redirect(this, "/report/page", { id: report.id }, false);
            actions = [
                icon.get("View", view),
                <AuthContext.Provider value={ true }>
                    <AdminContext.Provider value={ true }>
                        <ReportAdmin that={ this } id={ report.id } />
                    </AdminContext.Provider>
                </AuthContext.Provider>
            ];
            return table.reportBody(report, selection, this, actions);
        });

        let solvedReportRows = solvedReports.map((report) => {
            view = () => utils.redirect(this, "/report/page", { id: report.id }, false);
            actions = [
                icon.get("View", view),
                <AuthContext.Provider value={ true }>
                    <AdminContext.Provider value={ true }>
                        <ReportAdmin that={ this } id={ report.id } />
                    </AdminContext.Provider>
                </AuthContext.Provider>
            ];
            return table.reportBody(report, selection, this, actions);
        });

        this.setState({
            unsolvedTable: {
                head: table.reportHead(selection),
                body: unsolvedReportRows
            },
            solvedTable: {
                head: table.reportHead(selection),
                body: solvedReportRows
            }
        });
    }

    render() {
        return (
            <div className="report-log">
                <div className="column-heading main-heading">
                    <h1 class="center">{ this.state.title }</h1>
                </div>
                <article>
                    {
                        this.state.unsolvedTable.body.length > 0
                            ?
                            <div>
                                <div className="column-heading table-heading">
                                    <h2 className="center">{ `Kvar att göra: ${this.state.unsolvedTable.body.length}st`} { icon.get("Reported") }</h2>
                                </div>
                                <table className="results large-rows">
                                    <thead>
                                        { this.state.unsolvedTable.head }
                                    </thead>
                                    <tbody>
                                        { this.state.unsolvedTable.body }
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                    }

                    {
                        this.state.solvedTable.body.length > 0
                        ?
                        <div>
                            <div className="column-heading table-heading">
                                <h2 className="center">{ `Klar: ${this.state.solvedTable.body.length}st`} { icon.get("Report") }</h2>
                            </div>
                            <table className="results large-rows">
                                <thead>
                                    { this.state.solvedTable.head }
                                </thead>
                                <tbody>
                                    { this.state.solvedTable.body }
                                </tbody>
                            </table>
                        </div>
                        :
                        null
                    }

                    {
                        this.state.unsolvedTable.body.length + this.state.solvedTable.body.length === 0
                        ?
                        <h2 className="center">Inga fler ärenden</h2>
                        :
                        null
                    }
                </article>
            </div>
        );
    }
}

export default withRouter(ReportList);