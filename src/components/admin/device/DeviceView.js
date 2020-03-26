/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Redirect, Link } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
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
            column: "category",
            filter: "Alla"
        };
    }

    componentDidMount() {
        let state = this.props.restore("deviceViewState");

        if (state) {
            this.setState(state, () => this.loadClassroom(this.state.filter));
        } else {
            this.loadClassroom(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("deviceViewState", this.state);
    }

    loadClassroom(filter) {
        let column = this.state.column;
        let res = db.fetchAllWhere("device", column, filter);

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            });
        });
    }

    filter(filter) {
        this.loadClassroom(filter);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        filterCb={ this.filter }
                        url="device/category"
                        categoryName="name"
                        sourceState="deviceViewState"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results">
                    <thead>
                        <tr>
                            <th>Kategori</th>
                            <th>Märke</th>
                            <th>Model</th>
                            <th>Serial nummer</th>
                            <th>Köpt</th>
                            <th>Klassrum</th>
                            <th>Hantera</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.data
                            ?
                            this.state.data.map((device) => {
                                return [
                                    <tr>
                                        <td data-title="Kategori">{ icon.get(device.category) }</td>
                                        <td data-title="Märke">{ device.brand }</td>
                                        <td data-title="Model">{ device.model }</td>
                                        <td data-title="Serial nummer">{ device.serialnum }</td>
                                        <td data-title="Köpt">{ new Date(device.purchased).toISOString().substring(0, 10) }</td>
                                        <td data-title="Klassrum">{ device.classroomName || "-" }</td>
                                        <td data-title="Hantera">
                                            { icon.get("View", () => utils.redirect(this, "/device", {id: device.deviceID})) }
                                            { icon.get("Report", () => utils.redirect(this, "/report", {item: "device", id: device.deviceID, data: device})) }
                                        </td>
                                    </tr>
                                ];
                            })
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
