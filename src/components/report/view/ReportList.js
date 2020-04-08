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
            id: this.props.id || null,
            reports: [],
            reportsTable: {
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

        let reportRows = otherReports.map((report) => {
            return table.reportBody(report, selection, this, <ReportAdmin id={ report.id } />);
        });

        this.setState({
            reportsTable: {
                head: table.reportHead(selection),
                body: reportRows
            }
        });
    }

    render() {
        return (
            <div className="report-log">
                <div className="column-heading">
                    <h2 class="center">Pågående ärenden - { this.state.reportsTable.body.length }st</h2>
                </div>
                <article>
                    {
                        this.state.reportsTable.body.length > 0
                            ?
                            <div>
                                <table className="results large-rows">
                                    <thead>
                                        { this.state.reportsTable.head }
                                    </thead>
                                    <tbody>
                                        { this.state.reportsTable.body }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <h2 className="column-heading">Inga fler pågående ärenden</h2>
                    }
                </article>
            </div>
        );
    }
}

export default withRouter(ReportList);
