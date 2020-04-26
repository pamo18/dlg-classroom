/* eslint max-len: ["error", { "code": 300 }] */
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import DatePicker from '../../datepicker/DatePicker.js';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class DeviceUpdate extends Component {
    constructor(props) {
        super(props);
        this.getDevice = this.getDevice.bind(this);
        this.updateDevice = this.updateDevice.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.state = {
            title: "Redigera Utrustning",
            categories: [],
            deviceData: {},
            deviceGroups: [],
            deviceTemplate: "brand,model,(serialnum)",
            device: null
        };
    }

    componentDidMount() {
        this.categories();
    }

    categories() {
        let res = db.fetchAll("device/category");
        let that = this;

        res.then(function(data) {
            that.setState({
                categories: data
            }, () => that.loadDevices());
        });
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
            let purchased = new Date(res.purchased).toISOString().substring(0, 10);
            let expires = new Date(res.expires).toISOString().substring(0, 10);

            this.setState({
                device: {
                    id: res.id,
                    category: res.category,
                    brand: res.brand,
                    model: res.model,
                    purchased: purchased,
                    expires: expires,
                    warranty: res.warranty,
                    price: res.price,
                    serialnum: res.serialnum,
                    url: res.url,
                    message: res.message
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    updateDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let id = data.get("id");

        let device = {
            category: data.get("category"),
            brand: data.get("brand"),
            model: data.get("model"),
            purchased: data.get("purchased"),
            expires: data.get("expires"),
            warranty: data.get("warranty"),
            price: data.get("price"),
            serialnum: data.get("serialnum"),
            url: data.get("url"),
            message: data.get("message")
        };

        let res = db.update("device", id, device);

        res.then(utils.goBack(this));
    }

    inputHandler(e) {
        let key = e.target.name;
        let device = this.state.device;
        let val = e.target.value;

        if (key === "warranty") {
            val = parseInt(val);

            let period = utils.dateAddMonths(val, new Date(device.purchased));

            device.warranty = val;
            device.expires = period.end;
        } else {
            device[key] = e.target.value;
        }

        this.setState({
            device: device
        });
    }

    changeDate(date) {
        let device = this.state.device;
        let warranty = parseInt(device.warranty);
        let period = utils.dateAddMonths(warranty, new Date(date));

        device.purchased = period.start;
        device.expires = period.end;

        this.setState({
            device: device,
            showing: null
        });
    }

    render() {
        const { showing } = this.state;
        return (
            <article>
                <h2 className="center">Välj apparat att redigera</h2>
                <form action="/update" className="form-register" onSubmit={this.updateDevice}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getDevice(e.target.value) }>
                        <option disabled selected>Klicka för att välja</option>
                            { this.state.deviceGroups }
                    </select>
                    { this.state.device ?
                        <div>
                            <h2 class="center">{ this.state.title }</h2>

                            <input className="form-input" type="hidden" name="id" required value={ this.state.device.id } />

                            <label className="form-label">Kategori
                                <select className="form-input" type="text" name="category" required value={ this.state.device.category } onChange={ this.inputHandler } >
                                    {
                                        this.state.categories.map(function(device) {
                                            let category = device.category;
                                            return [
                                                <option key={ category } value={ category }>{ category }</option>
                                            ]
                                        })
                                    }
                                </select>
                            </label>

                            <label className="form-label">Märke
                                <input className="form-input" type="text" name="brand" required value={ this.state.device.brand } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Model
                                <input className="form-input" type="text" name="model" required value={ this.state.device.model } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Serial Nummer
                                <input className="form-input" type="text" name="serialnum" value={ this.state.device.serialnum } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Pris
                                <input className="form-input" type="text" name="price" placeholder="990,90" value={ this.state.device.price } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Köpt
                                <input
                                    className="form-input"
                                    type="date"
                                    name="purchased"
                                    placeholder="1/1/2020"
                                    value={ this.state.device.purchased }
                                    onClick={() => this.setState({ showing: !showing })}
                                    readonly
                                />
                            </label>

                            { showing
                                ? <DatePicker changeDate={ this.changeDate } />
                                : null
                            }

                            <label className="form-label">Garanti (Månader)
                                <input className="form-input" type="number" name="warranty" placeholder="24" value={ this.state.device.warranty } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Garanti giltid till
                                <input className="form-input" type="date" name="expires" placeholder="1/1/2025" readonly value={ this.state.device.expires } />
                            </label>

                            <label className="form-label">Länk URL
                                <input className="form-input" type="text" name="url" placeholder="www.device.se" value={ this.state.device.url } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Info
                                <textarea className="form-input" name="message" placeholder="Skriv något som kan vara intressant." value={ this.state.device.message } onChange={ this.inputHandler } />
                            </label>

                            <input className="button center-margin" type="submit" name="update" value="Uppdatera" />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(DeviceUpdate);
