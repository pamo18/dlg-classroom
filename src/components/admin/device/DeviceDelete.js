/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class DeviceDelete extends Component {
    constructor(props) {
        super(props);
        this.getDevice = this.getDevice.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.state = {
            title: "Radera Apparat",
            data: {},
            groups: [],
            nameTemplate: "brand,model,(serialnum)",
            device: null
        };
    }

    componentDidMount() {
        this.loadDevices();
    }

    loadDevices() {
        let that = this;
        let allData = {};
        let groups = {};
        let res = db.fetchAll("device");

        res.then(function(data) {
            data.forEach(function(row) {
                let formData = form.group(data, "category", "id", that.state.nameTemplate);

                that.setState({
                    data: formData.data,
                    groups: formData.groups
                });
            });
        });
    }

    getDevice(e) {
        let id = e.target.value;

        try {
            let res = this.state.data[id];
            let name = form.optionName(res, this.state.nameTemplate);

            this.setState({
                device: {
                    id: res.id,
                    name: name
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    deleteDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let id = data.get("id");
        let that = this;

        let res = db.delete("device", id);

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <div className="double-column">
                <div className="column-2">
                    <div className="form-wrapper">
                        <h2 className="center">Välj apparat att radera</h2>
                        <form action="/delete" className="form-register">
                            <select className="form-input" type="text" name="name" required onChange={ this.getDevice }>
                                <option disabled selected>Klicka för att välja</option>
                                    { this.state.groups }
                            </select>
                        </form>
                    </div>
                    { this.state.device ?
                        <div className="form-wrapper">
                            <h2 class="center">{ this.state.title }</h2>
                            <form action="/admin" className="form-register" onSubmit={this.deleteDevice}>
                                <input className="form-input" type="hidden" name="id" required value={ this.state.device.id } />

                                <label className="form-label">Namn
                                    <input className="form-input" type="text" name="name" required value={ this.state.device.name } />
                                </label>

                                <label className="form-label check-label">
                                    <input className="check-input" type="checkbox" name="confirm" required />
                                    Radera klassrummet från systemet?
                                </label><br />

                                <input className="button center-margin" type="submit" name="delete" value="Radera" />
                            </form>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(DeviceDelete);
