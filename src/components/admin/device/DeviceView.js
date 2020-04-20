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

class DeviceView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = {
            title: "Utrustning vy",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            data: [],
            deviceTable: {
                head: [],
                body: []
            },
            filter: {},
            selection: [
                ["category-caption-large", null],
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
            }, () => this.getDevices());
        });
    }

    getDevices() {
        let selection = this.state.selection;

        let deviceRows = this.state.data.map(async (device) => {
            let view = () => utils.redirect(this, "/device", { id: device.id });
            let edit = () => utils.redirect(this, `/admin/device/edit/${ device.id }`, {});
            let del = () => utils.redirect(this, `/admin/device/delete/${ device.id }`, {});
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemData: device });
            let reportStatus = await db.reportCheck("device", device.id);
            let actions = [
                icon.reportStatus(reportList, reportStatus),
                icon.get("View", view),
                icon.get("Edit", edit),
                icon.get("Delete", del)
            ];

            return table.deviceBody(device, selection, actions);
        });

        Promise.all(deviceRows).then((rows) => {
            this.setState({
                deviceTable: {
                    body: rows
                }
            });
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

                <table className="results-card">
                    <tbody>
                        { this.state.data
                            ?
                            this.state.deviceTable.body
                            :
                            null
                        }
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(DeviceView);
