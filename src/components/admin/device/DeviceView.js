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
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            title: "Utrustning vy",
            data: [],
            deviceTable: {
                head: [],
                body: []
            },
            column: "category",
            filter: "Alla",
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
        let column = this.state.column;
        let res = db.fetchAllWhere("device", column, filter);

        res.then((data) => {
            console.log(data);
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
            let edit = () => this.adminHandler("edit", device.id);
            let del = () => this.adminHandler("delete", device.id);
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "device", itemid: device.id });
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
        this.loadDevices(filter);
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        title="Kategori"
                        filterCb={ this.filter }
                        url="device/category"
                        category="name"
                        stateName="deviceCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results-home">
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
