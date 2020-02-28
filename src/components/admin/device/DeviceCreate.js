/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import '../Admin.css';

class DeviceCreate extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.createDevice = this.createDevice.bind(this);
        this.state = {
            title: "Ny Apparat",
            categories: []
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
            });
        });
    }

    createDevice(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let device = {
            category: data.get("category"),
            brand: data.get("brand"),
            model: data.get("model"),
            serialnum: data.get("serialnum"),
            url: data.get("url"),
            message: data.get("message"),
            price: data.get("price")
        };

        let res = db.insert("device", device);

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <div className="double-column">
                <div className="column-2">
                    <div className="form-wrapper">
                        <h2 class="center">{ this.state.title }</h2>
                        <form action="/login" className="form-register" onSubmit={ this.createDevice }>
                            <label className="form-label">Kategori
                                <select className="form-input" type="text" name="category" required>
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
                                <input className="form-input" type="text" name="brand" required />
                            </label>

                            <label className="form-label">Model
                                <input className="form-input" type="text" name="model" required />
                            </label>

                            <label className="form-label">Serial Nummer
                                <input className="form-input" type="text" name="serialnum" />
                            </label>

                            <label className="form-label">Pris
                                <input className="form-input" type="text" name="price" placeholder="990,90"/>
                            </label>

                            <label className="form-label">Länk URL
                                <input className="form-input" type="text" name="url" placeholder="www.device.se" />
                            </label>

                            <label className="form-label">Info
                                <textarea className="form-input" name="message" placeholder="Skriv något som kan vara intressant." />
                            </label>

                            <input className="button center-margin" type="submit" name="create" value="Skapa" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(DeviceCreate);
