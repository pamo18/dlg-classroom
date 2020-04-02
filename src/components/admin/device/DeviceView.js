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
                ["category", null],
                ["brand", null],
                ["model", null],
                ["serial", null],
                ["purchased", null],
                ["classroom", null],
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
            let report = () => utils.redirect(this, "/report", { itemGroup: "device", deviceData: device });
            let status = await db.reportCheck("device", device.id);
            let actions = [
                icon.get("View", view),
                icon.reportStatus(report, status)
            ];

            return table.deviceBody(device, selection, actions);
        });

        Promise.all(deviceRows).then((rows) => {
            this.setState({
                deviceTable: {
                    head: table.deviceHead(selection),
                    body: rows
                }
            });
        });
    }

    filter(filter) {
        this.loadDevices(filter);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        title="Kategori"
                        filterCb={ this.filter }
                        url="device/category"
                        categoryName="name"
                        stateName="deviceCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results">
                    <thead>
                        { this.state.deviceTable.head }
                    </thead>
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
