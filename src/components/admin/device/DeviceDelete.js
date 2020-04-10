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
            title: "Radera Utrustning",
            deviceData: {},
            deviceGroups: [],
            deviceTemplate: "brand,model,(serialnum)",
            device: null
        };
    }

    componentDidMount() {
        this.loadDevices();
    }

    loadDevices() {
        let res = db.fetchAll("device");
        let id = this.props.id || null;

        res.then((data) => {
            let organize = form.organize(data, "category", "id");
            let deviceData = organize.data;
            let deviceGroups = organize.groups;
            let template = this.state.deviceTemplate;
            let formGroups = form.group(deviceGroups, "id", template, (optionId) => optionId == id);

            this.setState({
                deviceData: deviceData,
                deviceGroups: formGroups
            }, () => {
                if (id) {
                    this.getDevice(id);
                }
            });
        });
    }

    getDevice(id) {
        try {
            let res = this.state.deviceData[id];
            let name = form.optionName(res, this.state.deviceTemplate);

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

        res.then(utils.goBack(this));
    }

    render() {
        return (
            <article>
                <h2 className="center">Välj apparat att radera</h2>
                <form action="/delete" className="form-register" onSubmit={this.deleteDevice}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getDevice(e.target.value) }>
                        <option disabled selected>Klicka för att välja</option>
                            { this.state.deviceGroups }
                    </select>
                    { this.state.device
                        ?
                        <div>
                            <h2 class="center">{ this.state.title }</h2>
                            <input className="form-input" type="hidden" name="id" required value={ this.state.device.id } />

                            <label className="form-label">Namn
                                <input className="form-input" type="text" name="name" required value={ this.state.device.name } />
                            </label>

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="confirm" required />
                                Radera klassrummet från systemet?
                            </label><br />

                            <input className="button center-margin" type="submit" name="delete" value="Radera" />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(DeviceDelete);
