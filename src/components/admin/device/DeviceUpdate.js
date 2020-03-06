/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
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
        this.state = {
            title: "Uppdatera Apparat",
            categories: [],
            data: {},
            groups: [],
            nameTemplate: "brand,model,(serialnum)",
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
        let that = this;
        let allData = {};
        let groups = {};
        let res = db.fetchAll("device");

        res.then(function(data) {
            let formData = form.group(data, "category", "id", that.state.nameTemplate);

            that.setState({
                data: formData.data,
                groups: formData.groups
            });
        });
    }

    getDevice(e) {
        let that = this;
        let id = e.target.value;

        try {
            let res = this.state.data[id];
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
        let that = this;

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

        res.then(utils.reload(this, "/"));
    }

    inputHandler(e) {
        let key = e.target.name;
        let device = this.state.device;
        device[key] = e.target.value;

        if (key === "warranty") {
            let purchased = new Date(device.purchased);

            purchased.setMonth(purchased.getMonth() + e.target.value);
            device.expires = purchased.toISOString().substring(0, 10);
        }

        this.setState({
            device: device
        });
    }

    render() {
        return (
            <div className="form-wrapper">
                <h2 className="center">Välj apparat att uppdatera</h2>
                <form action="/update" className="form-register" onSubmit={this.updateDevice}>
                    <select className="form-input" type="text" name="fullname" required onChange={ this.getDevice }>
                        <option disabled selected>Klicka för att välja</option>
                            { this.state.groups }
                    </select>
                    { this.state.device ?
                        <div>
                            <h2 class="center">{ this.state.title }</h2>

                            <input className="form-input" type="hidden" name="id" required value={ this.state.device.id } />

                            <label className="form-label">Kategori
                                <select className="form-input" type="text" name="category" required value={ this.state.device.category } onChange={ this.inputHandler } >
                                    {
                                        this.state.categories.map(function(cat) {
                                            let name = cat.name;
                                            return [
                                                <option key={ name } value={ name }>{ name }</option>
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
                                <input className="form-input" type="text" name="purchased" placeholder="1/1/2020" value={ this.state.device.purchased } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Garanti (Månader)
                                <input className="form-input" type="text" name="warranty" placeholder="24" value={ this.state.device.warranty } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Garanti giltid till
                                <input className="form-input" type="text" name="expires" placeholder="1/1/2025" readonly value={ this.state.device.expires } />
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
            </div>
        );
    }
}

export default withRouter(DeviceUpdate);
