/* eslint max-len: ["error", { "code": 300 }] */
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class ReportUpdate extends Component {
    constructor(props) {
        super(props);
        this.updateReport = this.updateReport.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.state = {
            title: "Uppdatera felanmälning",
            reportData: [],
            reportGroups: [],
            reportTemplate: "classroom_name,-name",
            report: null,
        };
    }

    componentDidMount() {
        this.loadReports();
    }

    loadReports() {
        let res = db.fetchAll("report");
        let id = this.props.id || null;

        res.then((data) => {
            let organize = form.organize(data, "item_group", "id");
            let reportData = organize.data;
            let reportGroups = organize.groups;
            let template = this.state.reportTemplate;
            let formGroups = form.group(reportGroups, "id", template, (optionId) => optionId == id);

            this.setState({
                reportData: reportData,
                reportGroups: formGroups
            },() => {
                if (id) {
                    this.getReport(id);
                }
            });
        });
    }

    getReport(id) {
        try {
            let res = this.state.reportData[id];
            res.solved = res.solved ? utils.convertSqlDate(res.solved) : null;

            this.setState({
                report: res
            });
        } catch(err) {
            console.log(err);
        }
    }

    updateReport(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let report = this.state.report;
        let id = report.id;
        let checkbox = data.get("solved");
        let res;

        report.name = data.get("name");
        report.message = data.get("message");
        report.action = data.get("action");
        report.from = JSON.parse(localStorage.getItem("person"));

        if (checkbox) {
            report.solved = this.state.report.solved;
            res = db.reportSolved(id, report);
        } else {
            report.solved = false;
            res = db.update("report", id, report);
        }

        res.then(() => utils.goBack(this));
    }

    inputHandler(e) {
        let key = e.target.name;
        let report = this.state.report;
        let value = e.target.value;

        if (key === "solved") {
            report[key] = report[key] ? false : utils.getLocalDate();
        } else {
            report[key] = value;
        }

        this.setState({
            report: report
        });
    }

    render() {
        return (
            <article>
                <h2 className="center">Välj felanmälning att uppdatera</h2>
                <form className="form-register" onSubmit={this.updateReport}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getReport(e.target.value) }>
                        <option disabled selected value>Klicka här</option>
                        { this.state.reportGroups }
                    </select>
                    { this.state.report
                        ?
                        <div>
                            <h2 className="center">{ this.state.title }</h2>

                            <label className="form-label">Titel
                                <input className="form-input" type="text" name="name" required value={ this.state.report.name } placeholder="Ett namn som förklare snabbt problemet." onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Meddelande
                                <textarea className="form-input" name="message" required value={ this.state.report.message } placeholder="Skriv något om problemet." onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Åtgärd
                                <input className="form-input" type="text" name="action" placeholder="Förklara hur den blev åtgärdat" value={ this.state.report.action } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="solved" value={ this.state.report.solved } checked={ this.state.report.solved ? "checked" : false } onChange={ this.inputHandler } />
                                Åtgärdat { this.state.report.solved ? " - " + this.state.report.solved : null }
                            </label><br />

                            <input className="button center-margin" type="submit" name="create" value="Uppdatera" />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(ReportUpdate);
