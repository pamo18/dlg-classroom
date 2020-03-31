/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
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
            reports: [],
            reportsTable: {},
            itemGroup: this.props.itemGroup,
            itemid: this.props.itemid
        };
    }

    componentDidMount() {
        this.loadReports(this.state.itemGroup, this.state.itemid)
    }

    loadReports(itemGroup, itemid) {
        let res;

        if (itemGroup === "classroom") {
            res = db.fetchAllWhere("report/classroom", "item_id", itemid);
        } else {
            res = db.fetchAllWhere("report/device", "item_id", itemid);
        }

        res.then((data) => {
            this.setState({
                reports: data
            },() => this.getReports());
        });
    }

    getReports() {
        let reportRows = this.state.reports.map((report) => {
            let key = `report-${report.id}`;
            let view = () => utils.redirect(this, `/report`, { dataType: `report-${report.item_group}`, reportData: report });
            let edit = () => this.adminHandler("edit", report.id);
            let del = () => this.adminHandler("delete", report.id);
            let actions = [
                icon.get("View", view)
            ];

            return table.userRowReport(key, report, actions, this);
        });

        this.setState({
            reportsTable: {
                head: table.userHeadReport(),
                body: reportRows
            }
        });
    }

    render() {
        return (
            <div className="report-log">
                {
                    this.state.reports.length > 0
                        ?
                        <div>
                            <h2 class="center">Pågående ärenden: { this.state.reports.length }st </h2>
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
                        <h2 class="center">Inga pågående ärenden</h2>
                }
            </div>
        );
    }
}

export default withRouter(ReportList);
