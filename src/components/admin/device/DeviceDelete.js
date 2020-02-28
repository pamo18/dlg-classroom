/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import '../Admin.css';

class DeviceDelete extends Component {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.getDevice = this.getDevice.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.state = {
            title: "Radera Apparat",
            data: {},
            groups: {},
            groupOptions: null,
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
                let id = row.id;
                let category = row.category;

                allData[id] = row;

                if (!groups.hasOwnProperty(category)) {
                    groups[category] = [];
                }

                groups[category].push(row);
            });

            that.setState({
                data: allData,
                groups: groups
            }, () => that.getOptions());
        });
    }

    getOptions() {
        let that = this;
        let groups = this.state.groups;
        let groupOptions = [];

        Object.keys(groups).forEach((key) => {
            let options = [];

            groups[key].forEach(function(option) {
                let id = option.id;
                let name = `${option.brand} ${option.model} (${option.serialnum})`;

                options.push(
                    <option key={ id } value={ id }>{ name }</option>
                );
            })

            groupOptions.unshift(
                <optgroup label={ key }>
                    { options }
                </optgroup>
            );
        });

        that.setState({
            groupOptions: groupOptions
        });
    }

    getDevice(e) {
        let that = this;
        let id = e.target.value;

        try {
            let res = this.state.data[id];
            let name = `${res.brand} ${res.model} (${res.serialnum})`;

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
                                    { this.state.groupOptions }
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
