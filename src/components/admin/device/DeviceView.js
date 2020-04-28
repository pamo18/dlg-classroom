/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';
import DeviceCards from '../../device/DeviceCards.js';

class DeviceView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = {
            title: "Visa Utrustning",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            data: [],
            deviceTable: {
                head: [],
                body: []
            },
            filter: {},
            selection: [
                ["category-caption-advanced", null],
                ["manage", null]
            ]
        };
    }

    componentDidMount() {
        let state = this.props.restore("deviceViewState");

        if (state) {
            this.setState(state, () => this.loadDevices(this.state.filter));
        } else {
            this.loadDevices(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("deviceViewState", this.state);
    }

    loadDevices(filter) {
        let res = db.fetchAllManyWhere("device", filter);

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            }, () => this.devices.updateData(this.state.data));
        });
    }

    filter(category, filter) {
        let currentFilter = this.state.filter;

        currentFilter[category] = filter;

        this.setState({
            filter: currentFilter
        }, () => this.loadDevices(this.state.filter));
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
                        title="Filter Kategori"
                        filterCb={ this.filter }
                        url="device/category"
                        category="category"
                        stateName="deviceCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />

                    <Categories
                        title="Filter Status"
                        filterCb={ this.filter }
                        url="report/filter"
                        category="solved"
                        stateName="deviceCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <DeviceCards
                    onRef={ref => (this.devices = ref)}
                    devices={ this.state.data }
                    choice={ ["status", "view", "edit", "delete"] }
                    selection={ this.state.selection }
                />
            </article>
        );
    }
}

export default withRouter(DeviceView);
