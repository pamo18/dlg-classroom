/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import db from '../../../models/db.js';
import '../Admin.css';

class DeviceCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Skapa Enhet",
            categories: []
        };
    }

    componentDidMount() {
        this.categories();
    }

    categories() {
        let res = db.getDeviceCategories();
        let that = this;

        res.then(function(data) {
            that.setState({
                categories: data
            });
        });
    }

    render() {
        return (
            <div className="form-wrapper">
                <h2 class="center">{ this.state.title }</h2>
                <form action="/login" className="form-register" onSubmit={this.registerSubmit}>
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
                        <input className="form-input" type="number" name="serialnum" />
                    </label>

                    <label className="form-label">Länk URL
                        <input className="form-input" type="text" name="url" placeholder="www.device.se" />
                    </label>

                    <label className="form-label">Info
                        <textArea className="form-input" name="message" placeholder="Skriv något som kan vara intressant." />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Skapa" />
                </form>
            </div>
        );
    }
}

export default DeviceCreate;
