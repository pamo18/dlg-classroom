/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import DatePicker from '../../datepicker/DatePicker.js';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import '../Admin.css';

class DeviceCreate extends Component {
    constructor(props) {
        super(props);
        this.createDevice = this.createDevice.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.state = {
            title: "Lägga till Utrustning",
            categories: [],
            warranty: 24,
            purchased: "",
            expires: "",
            showing: null
        };
    }

    componentDidMount() {
        let period = utils.dateAddMonths(this.state.warranty);

        this.setState({
            purchased: period.start,
            expires: period.end
        }, () => this.categories())
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
            price: data.get("price"),
            purchased: data.get("purchased"),
            warranty: data.get("warranty"),
            expires: data.get("expires")
        };

        let res = db.insert("device", device);

        res.then(utils.reload(this, "/admin/device/view"));
    }

    inputHandler(e) {
        let key = e.target.name;
        let val = e.target.value;

        if (key === "warranty") {
            val = parseInt(val);

            let period = utils.dateAddMonths(val, new Date(this.state.purchased));

            this.setState({
                warranty: val,
                expires: period.end
            });
        } else {
            this.setState({
                [key]: val
            });
        }
    }

    changeDate(date) {
        let warranty = parseInt(this.state.warranty);
        let period = utils.dateAddMonths(warranty, new Date(date));

        this.setState({
            purchased: period.start,
            expires: period.end,
            showing: null
        });
    }

    render() {
        const { showing } = this.state;
        return (
            <article>
                <h2 class="center">{ this.state.title }</h2>
                <form action="/login" className="form-register" onSubmit={ this.createDevice }>
                    <label className="form-label">Kategori
                        <select className="form-input" type="text" name="category" required>
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

                    <label className="form-label">Köpt
                        <input
                            className="form-input"
                            type="date"
                            name="purchased"
                            placeholder="1/1/2020"
                            value={ this.state.purchased }
                            onClick={() => this.setState({ showing: !showing })}
                            readOnly
                        />
                    </label>

                    { showing
                        ? <DatePicker changeDate={ this.changeDate } />
                        : null
                    }

                    <label className="form-label">Garanti (Månader)
                        <input className="form-input" type="number" name="warranty" placeholder="24" value={ this.state.warranty } onChange={ this.inputHandler } />
                    </label>

                    <label className="form-label">Garanti giltid till
                        <input className="form-input" type="date" name="expires" placeholder="1/1/2025" readonly value={ this.state.expires } />
                    </label>

                    <label className="form-label">Länk URL
                        <input className="form-input" type="text" name="url" placeholder="www.device.se" />
                    </label>

                    <label className="form-label">Info
                        <textarea className="form-input" name="message" placeholder="Skriv något som kan vara intressant." />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Skapa" />
                </form>
            </article>
        );
    }
}

export default withRouter(DeviceCreate);
