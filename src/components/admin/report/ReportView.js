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
        this.toggleFilter = this.toggleFilter.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            title: "Report vy",
            toggle: "close",
            data: [],
            reportsTable: {
                head: [],
                body: []
            },
            filter: {
                location: "Alla"
            },
            selection : [
                ["item-category", "15%"],
                ["title", "35%"],
                ["created", "15%"],
                ["solved", "15%"],
                ["manage", "20%"]
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
        let res = db.fetchAllManyWhere("report", filter);

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

    filter(category, filter) {
        let currentFilter = this.state.filter;

        currentFilter[category] = filter;

        this.setState({
            filter: currentFilter
        }, () => this.loadReports(this.state.filter));
    }

    toggleFilter() {
        this.setState({
            toggle: this.state.toggle === "close" ? "open" : "close"
        });
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className={`filter-panel ${ this.state.toggle }`}>
                    <div className="dropdown">
                        { icon.get(this.state.toggle === "close" ? "Drop-down" : "Drop-up", this.toggleFilter) }
                    </div>
                    <div className="admin-control category-control">
                        <Categories
                            title="Hus"
                            filterCb={ this.filter }
                            url="classroom/building"
                            category="location"
                            stateName="reportCategory1"
                            save={ this.props.save }
                            restore={ this.props.restore }
                        />
                    </div>

                    <div className="admin-control category-control">
                        <Categories
                            title="Status"
                            filterCb={ this.filter }
                            url="report/filter"
                            category="solved"
                            stateName="reportCategory2"
                            save={ this.props.save }
                            restore={ this.props.restore }
                        />
                    </div>
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
