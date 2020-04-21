/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ReportFilterList from '../../report/components/ReportFilterList.js';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
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
        this.state = {
            title: "Report vy",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            data: [],
            reportsTable: {
                head: [],
                body: []
            },
            filter: {},
            actions: ["view", "edit", "delete"],
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
            let view = () => utils.redirect(this, "/report/page", { id: report.id, itemGroup: report.item_group, itemData: report });
            let edit = () => utils.redirect(this, `/admin/report/edit/${ report.id }`, {});
            let del = () => utils.redirect(this, `/admin/report/delete/${ report.id }`, {});
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
        }, () => this.list.loadReports());
    }

    toggleFilter() {
        this.setState({
            toggle: this.state.toggle === "close" ? "open" : "close"
        });
    }

    render() {
        return (
            <article>
                <div className={`filter-panel ${ this.state.toggle }`}>
                    <div className="dropdown">
                        { icon.get(this.state.toggle === "close" ? "Drop-down" : "Drop-up", this.toggleFilter) }
                    </div>
                    <Categories
                        title="Filter Hus"
                        filterCb={ this.filter }
                        url="classroom/building"
                        category="building"
                        stateName="reportCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />

                    <Categories
                        title="Filter Status"
                        filterCb={ this.filter }
                        url="report/filter"
                        category="solved"
                        stateName="reportCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <ReportFilterList
                    onRef={ref => (this.list = ref)}
                    title="Aktuella Felanmälningar"
                    filter={ this.state.filter }
                    selection={ this.state.selection }
                    actions={ this.state.actions }
                />
            </article>
        );
    }
}

export default withRouter(ReportView);
