/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Redirect, Link } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import table from '../../../models/table.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.getReports = this.getReports.bind(this);
        this.filter1 = this.filter1.bind(this);
        this.filter2 = this.filter2.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            data: [],
            column1: "location",
            column2: "solved",
            filter1: "Alla",
            filter2: "Alla",
            reportsTable: {
                head: [],
                body: []
            },
            selection : [
                ["title", null],
                ["classroom", null],
                ["item", null],
                ["solved", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        let state = this.props.restore("reportViewState");

        if (state) {
            this.setState(state, () => this.loadReports(this.state.filter));
        } else {
            this.loadReports(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("reportViewState", this.state);
    }

    loadReports(filter, column) {
        let res;
        let filter1;
        let filter2;
        let column1 = this.state.column1;
        let column2 = this.state.column2;

        if (column === 1) {
            filter1 = filter;
            filter2 = this.state.filter2;
        } else if (column === 2) {
            filter1 = this.state.filter1;
            filter2 = filter;
        } else {
            filter1 = this.state.filter1;
            filter2 = this.state.filter2;
        }

        if (filter1 === "Alla" && filter2 === "Alla") {
            res = db.fetchAll("report");
        } else {
            res = db.fetchAllWhere("report", column1, filter1, column2, filter2);
        }

        res.then((data) => {
            this.setState({
                data: data,
                [`filter${column}`]: filter
            }, () => this.getReports());
        });
    }

    getReports() {
        let selection = this.state.selection;

        let reportRows = this.state.data.map((report) => {
            let key = `report-${report.id}`;
            let view = () => utils.redirect(this, "/report/page", { id: report.id });
            let edit = () => this.adminHandler("edit", report.id);
            let del = () => this.adminHandler("delete", report.id);
            let actions = [
                icon.get("View", view),
                icon.get("Edit", edit),
                icon.get("Delete", del)
            ];

            return table.reportBody(report, selection, this, actions);
        });

        this.setState({
            reportsTable: {
                head: table.reportHead(selection),
                body: reportRows
            }
        });
    }

    filter1(filter) {
        this.loadReports(filter, 1);
    }

    filter2(filter) {
        this.loadReports(filter, 2);
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        title="Hus"
                        filterCb={ this.filter1 }
                        url="building"
                        categoryName="name"
                        stateName="reportCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <div className="admin-control category-control">
                    <Categories
                        title="Status"
                        filterCb={ this.filter2 }
                        url="report/filter"
                        categoryName="status"
                        stateName="reportCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <h2 class="center">Aktuella Felanmälningar: { this.state.reportsTable.body.length }st </h2>

                <table className="results large-rows">
                    <thead>
                        { this.state.reportsTable.head }
                    </thead>
                    <tbody>
                        { this.state.reportsTable.body }
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ReportView);
