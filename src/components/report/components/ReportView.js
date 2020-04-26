/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import '../Report.css';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            report: null
        };
    }

    componentDidMount() {
        this.loadReport();
    }

    loadReport() {
        let res = db.fetchWhere("report", "report.id", this.state.id);

        res.then((data) => {
            if (data) {
                this.setState({
                    report: data
                });
            } else {
                utils.redirect(this, "/");
            }
        });
    }

    render() {
        return this.state.report && (
            <div className="single-column">
                <h2 className="center margin">
                    { icon.get("Maintenance") }<br />
                    Rapport
                </h2>

                <table className="results-alt">
                    <tr>
                        <th>Titel</th>
                        <td>{ this.state.report.name }</td>
                    </tr>
                    <tr>
                        <th>Vad</th>
                        <td>{ this.state.report.device_id ? this.state.report.device_brand + " " + this.state.report.device_model : "Allmänt" }</td>
                    </tr>
                    <tr>
                        <th>Meddelande</th>
                        <td className={ this.state.report.message.length > 100 ? "left" : null }>{ this.state.report.message }</td>
                    </tr>
                    <tr>
                        <th>Åtgärd</th>
                        <td>{ this.state.report.action || "-" }</td>
                    </tr>
                    <tr>
                        <th>Åtgärdat</th>
                        <td>{ this.state.report.solved ? utils.convertSqlDate(this.state.report.solved) : "-" }</td>
                    </tr>
                    <tr>
                        <th>Skapad</th>
                        <td>{ this.state.report.created ? utils.convertSqlDate(this.state.report.created) : "-" }</td>
                    </tr>
                    <tr>
                        <th>Person</th>
                        <td>{ this.state.report.person }</td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default withRouter(ReportView);
