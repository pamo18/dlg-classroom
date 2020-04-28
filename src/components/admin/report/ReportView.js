/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import ReportFilterList from '../../report/components/ReportFilterList.js';
import  { withRouter } from 'react-router-dom';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';

class ReportView extends Component {
    constructor(props) {
        super(props);
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
            this.setState(state);
        }
    }

    componentWillUnmount() {
        this.props.save("reportViewState", this.state);
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
                    stateName="reportFilterList"
                    save={ this.props.save }
                    restore={ this.props.restore }
                />
            </article>
        );
    }
}

export default withRouter(ReportView);
