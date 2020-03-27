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
            report: [],
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
        this.getReports();
        this.getItem();
    }

    getReports() {
        let item = this.state.item;
        let id = this.state.id;
        let res = db.fetchAllWhere("report", item, id);

        res.then((data) => {
            this.setState({
                report: data
            });
        });
    }

    getItem() {
        let item = this.state.item;
        let id = this.state.id;
        let data = this.state.data;
        let key,
            view,
            actions;

        switch(true) {
            case (item === "classroom"):
                key = `report-classroom`;
                view = () => utils.redirect(this, "/classroom", {id: this.state.id});
                actions = icon.get("View", view);

                this.setState({
                    deviceTable: {
                        head: table.userHeadClassroom(),
                        body: table.userRowClassroom(key, data, actions)
                    }
                });
                break;
            case (item === "device"):
                key = `report-device`;
                view = () => utils.redirect(this, "/device", {id: this.state.id});
                actions = icon.get("View", view);

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
                    name:  data.get("name"),
                    message: data.get("message")
                };

                res = db.insert("report", classroom);
                break;
            case (item === "device"):
                let device = {
                    item: "device",
                    item_id: this.state.id,
                    name:  data.get("name"),
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
                <h2 className="center">
                    { this.state.title }
                    <br />
                    { icon.get("Message") }
                </h2>
                <table className="results">
                    <thead>
                        { this.state.deviceTable.head }
                    </thead>
                    <tbody>
                        { this.state.deviceTable.body }
                    </tbody>
                </table>

                {
                    this.state.report
                        ?
                        <div className="report-log">
                            <h2 class="center">Alla felanmälningar, { this.state.report.length }st</h2>
                            <table className="results gap">
                                <thead>
                                    <tr>
                                        <th>Beskrivning</th>
                                        <th>Åtgärdning</th>
                                        <th>Åtgärdat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.report.map((row) => {
                                        return [
                                            <tr key={`report-${row.id}`}>
                                                <td data-title="Beskrivning">{ row.message }</td>
                                                <td data-title="Åtgärdning">{ row.action || "-" }</td>
                                                <td data-title="Åtgärdat">{ row.solved || "-" }</td>
                                            </tr>
                                        ];
                                    })}
                                </tbody>
                            </table>
                        </div>
                        :
                        null
                }

                <form className="form-register" onSubmit={this.reportItem}>
                    <label className="form-label">Titel
                        <input className="form-input" type="text" name="name" placeholder="Ett namn som förklare snabbt problemet." />
                    </label>

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
