/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ReportAdmin from './ReportAdmin';
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
            title: "Pågående ärenden",
            id: this.props.id || null,
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
            itemid: this.props.itemid || this.props.location.state.itemid,
            selection : [
                ["item-category", "10%"],
                ["title", "35%"],
                ["created", "20%"],
                ["solved", "20%"],
                ["manage", "15%"]
            ]
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        this.loadReports(this.state.itemGroup, this.state.itemid);
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }

        window.scrollTo(0, 0);
    }

    loadReports(itemGroup, itemid) {
        let res;
        let res2;
        let deviceRes;

        if (itemGroup === "classroom") {
            res = db.fetchAllWhere("report/classroom", "item_id", itemid);

            res.then((data) => {
                res2 = db.fetchAllWhere("classroom/device", "classroom_id", itemid);

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
            res = db.fetchAllWhere("report/device", "item_id", itemid);

            res.then((data) => {
                this.setState({
                    reports: data
                },() => this.getReports());
            });
        }
    }

    getReports() {
        let selection = this.state.selection;
        let otherReports = this.state.reports.filter((report) => report.id != this.state.id);
        let unsolvedReports = otherReports.filter((report) => !report.solved);
        let solvedReports = otherReports.filter((report) => report.solved);

        let unsolvedReportRows = unsolvedReports.map((report) => {
            return table.reportBody(report, selection, this, <ReportAdmin id={ report.id } />);
        });

        let solvedReportRows = solvedReports.map((report) => {
            return table.reportBody(report, selection, this, <ReportAdmin id={ report.id } />);
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
                    <h2 class="center">{ this.state.title }</h2>
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
                        <h2 className="center">Inga fler pågående ärenden</h2>
                        :
                        null
                    }
                </article>
            </div>
        );
    }
}

export default withRouter(ReportList);
