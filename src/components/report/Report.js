/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import icon from '../../models/icon.js';
import table from '../../models/table.js';
import './Report.css';

class Report extends Component {
    constructor(props) {
        super(props);
        this.reportItem = this.reportItem.bind(this);
        this.state = {
            title: "Felanmäla",
            item: this.props.location.state.item,
            id: this.props.location.state.id,
            data: this.props.location.state.data,
            deviceTable: {
                head: [],
                table: []
            }
        };
    }

    componentDidMount() {
        this.getItem();
        console.log(this.state);
    }

    getItem() {
        let item = this.state.item;
        let id = this.state.id;
        let data = this.state.data;

        switch(true) {
            case (item === "classroom"):
                break;
            case (item === "device"):
                let key = `report-device`;
                let view = () => utils.redirect(this, "/device", {id: this.state.id});
                let actions = icon.get("View", view);

                this.setState({
                    deviceTable: {
                        head: table.userHeadDevice(),
                        body: table.userRowDevice(key, data, actions)
                    }
                });
                break;
        }
    }

    reportItem(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let item = this.state.item;
        let res;

        switch(true) {
            case (item === "classroom"):
                let classroom = {
                    item: "classroom",
                    item_id: this.state.id,
                    message: data.get("message")
                };

                res = db.insert("classroom", classroom);
                break;
            case (item === "device"):
                let device = {
                    item: "device",
                    item_id: this.state.id,
                    message: data.get("message")
                };

                res = db.insert("report", device);
                break;
        }

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                {
                    this.state.item === "device"
                        ?
                        <table className="results">
                            <thead>
                                { this.state.deviceTable.head }
                            </thead>
                            <tbody>
                                { this.state.deviceTable.body }
                            </tbody>
                        </table>
                        :
                        null
                }
                <form action="/create" className="form-register" onSubmit={this.reportItem}>
                    <label className="form-label">Meddelande
                        <textarea className="form-input" name="message" placeholder="Skriv något om problemet." />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Felanmäla" />
                </form>
            </article>
        );
    }
}

export default withRouter(Report);
