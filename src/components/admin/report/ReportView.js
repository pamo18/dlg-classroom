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
        this.filter = this.filter.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            data: [],
            column: "location",
            filter: "Alla",
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

    loadReports(filter) {
        let column = this.state.column;
        let res;

        if (filter === "Alla") {
            res = db.fetchAll("report");
        } else {
            res = db.fetchAllWhere("report", column, filter);
        }

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
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

    filter(filter) {
        this.loadReports(filter);
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        filterCb={ this.filter }
                        url="building"
                        categoryName="name"
                        sourceState="reportViewState"
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
