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
            filter: "category",
            value: "Alla"
        };
    }

    componentDidMount() {
        let state = this.props.restore("deviceViewState");

        if (state) {
            this.setState(state);
        } else {
            this.loadClassroom(this.state.filter, this.state.value);
        }
    }

    componentWillUnmount() {
        this.props.save("deviceViewState", this.state);
    }

    loadClassroom(filter, value) {
        let res;

        if (value === "Alla") {
            res = db.fetchAll("device");
        } else {
            res = db.fetchAllWhere("device", filter, value);
        }

        res.then((data) => {
            this.setState({
                data: data,
                value: value
            });
        });
    }

    filter(value) {
        this.loadClassroom(this.state.filter, value);
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>
                        { this.state.title }
                    </h1>
                </div>
                <article>
                    <div className="single-column">
                        <div className="admin-control category-control">
                            <Categories
                                filterCb={ this.filter }
                                url="device/category"
                                name="name"
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
                                    <th>Pris</th>
                                    <th>Serial nummer</th>
                                    <th>Köpt</th>
                                    <th>Hus</th>
                                    <th>Hantera</th>
                                </tr>
                            </thead>

                        { this.state.data
                            ?
                            this.state.data.map((device) => {
                                return [
                                    <tbody>
                                        <tr>
                                            <td>{ icon.get(device.category) }</td>
                                            <td>{ device.brand }</td>
                                            <td>{ device.model }</td>
                                            <td>{ device.price }:-</td>
                                            <td>{ device.serialnum }</td>
                                            <td>{ new Date(device.purchased).toISOString().substring(0, 10) }</td>
                                            <td>{ device.location || "-" }</td>
                                            <td>{ icon.get("View", () => utils.redirect(this, "/device", {id: device.deviceID})) }</td>
                                        </tr>
                                    </tbody>
                                ];
                            })
                            :
                            null
                        }

                        </table>
                    </div>
                </article>
            </main>
        );
    }
}

export default withRouter(DeviceView);
