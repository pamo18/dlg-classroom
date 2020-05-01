/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint-disable react/jsx-no-target-blank */

import React, { Component } from 'react';
import { AdminContext } from "../auth/auth.js";
import db from '../../models/db.js';
import icon from '../../models/icon.js';
import './Device.css';

class Device extends Component {
    static contextType = AdminContext;
    constructor(props) {
        super(props);
        this.state = {
            title: "Utrustning",
            id: "",
            device: {}
        };
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({
                id: this.props.location.state.id
            }, () => this.loadDevice());
        }
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    loadDevice() {
        let that = this;
        let res = db.fetchWhere("device", "device.id", this.state.id);

        res.then(function(data) {
            that.setState({
                device: data
            });
        });
    }

    render() {
        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article className="device-view">
                        <div>
                            { this.state.device && Object.entries(this.state.device).length > 0
                                ?
                                <div>
                                    <h2 className="center margin">
                                        { icon.get(this.state.device.category) }<br />
                                        { this.state.device.brand + " " + this.state.device.model}
                                    </h2>
                                    <table className="results-alt">
                                        <tbody>
                                            <tr>
                                                <th>Kategori</th>
                                                <td>{ this.state.device.category }</td>
                                            </tr>
                                            <tr>
                                                <th>Märke</th>
                                                <td>{ this.state.device.brand }</td>
                                            </tr>
                                            <tr>
                                                <th>Model</th>
                                                <td>{ this.state.device.model }</td>
                                            </tr>

                                            { this.context.isAdmin &&
                                                <tr>
                                                    <th>Pris</th>
                                                    <td>{ this.state.device.price }:-</td>
                                                </tr>
                                            }

                                            { this.context.isAdmin &&
                                                <tr>
                                                    <th>Serial nummer</th>
                                                    <td>{ this.state.device.serialnum }</td>
                                                </tr>
                                            }

                                            { this.context.isAdmin &&
                                                <tr>
                                                    <th>Köpt</th>
                                                    <td>{ new Date(this.state.device.purchased).toISOString().substring(0, 10) }</td>
                                                </tr>
                                            }

                                            { this.context.isAdmin &&
                                                <tr>
                                                    <th>Garanti giltid till</th>
                                                    <td>{ new Date(this.state.device.expires).toISOString().substring(0, 10) }</td>
                                                </tr>
                                            }

                                            { this.context.isAdmin &&
                                                <tr>
                                                    <th>Garanti månader</th>
                                                    <td>{ this.state.device.warranty }</td>
                                                </tr>
                                            }

                                            <tr>
                                                <th>Länk URL</th>
                                                <td><a href={ this.state.device.url } target="_blank">Till produktsida</a></td>
                                            </tr>
                                            <tr>
                                                <th>Info</th>
                                                <td>{ this.state.device.message }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                :
                                null
                                }
                        </div>
                    </article>
                </div>
            </main>
        );
    }
}

export default Device;
