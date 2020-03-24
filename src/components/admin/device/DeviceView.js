/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
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
            id: null,
            data: [],
            dataCategory: [],
            filter: "category",
            value: "all"
        };
    }

    componentDidMount() {
        this.loadDevice(this.state.filter, this.state.value);
    }

    loadDevice(filter, value) {
        let that = this;
        let res = db.fetchAllWhere("device", filter, value);

        res.then(function(data) {
            that.setState({
                data: data
            });
        });
    }

    filter(value) {
        this.loadDevice(this.state.filter, value);
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
                        <Categories
                            filterCb={ this.filter }
                            url="device/category"
                            name="name"
                        />
                        <table className="results">
                            <thead>
                                <tr>
                                    <th>Kategori</th>
                                    <th>Märke</th>
                                    <th>Model</th>
                                    <th>Pris</th>
                                    <th>Serial nummer</th>
                                    <th>Köpt</th>
                                    <th>Garanti giltid till</th>
                                    <th>Hus</th>
                                </tr>
                            </thead>

                        { this.state.data.map((device) => {
                            return [
                                <tbody>
                                    <tr>
                                        <td>{ device.category }</td>
                                        <td>{ device.brand }</td>
                                        <td>{ device.model }</td>
                                        <td>{ device.price }:-</td>
                                        <td>{ device.serialnum }</td>
                                        <td>{ new Date(device.purchased).toISOString().substring(0, 10) }</td>
                                        <td>{ new Date(device.expires).toISOString().substring(0, 10) }</td>
                                        <td>{ device.location || "-" }</td>
                                    </tr>
                                </tbody>
                            ];
                        })}

                        </table>
                    </div>
                </article>
            </main>
        );
    }
}

export default DeviceView;
