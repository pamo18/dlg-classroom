/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class ReportUpdate extends Component {
    constructor(props) {
        super(props);
        this.getReport = this.getReport.bind(this);
        this.updateReport = this.updateReport.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.state = {
            title: "Uppdatera felanmälning",
            reportData: [],
            reportGroups: [],
            reportTemplate: "classroom_name,device_brand,device_model",
            report: null,
        };
    }

    componentDidMount() {
        this.loadReports();
    }

    loadReports() {
        let res = db.fetchAll("report");

        res.then((data) => {
            let organize = form.organize(data, "item", "id");
            let reportData = organize.data;
            let reportGroups = organize.groups;
            let template = this.state.reportTemplate;
            let formGroups = form.group(reportGroups, "id", template);

            this.setState({
                reportData: reportData,
                reportGroups: formGroups
            },() => {
                if (this.props.id) {
                    this.getReport(this.props.id);
                }
            });
        });
    }

    getReport(id) {
        try {
            let res = this.state.reportData[id];
            let name = form.optionName(res, this.state.reportTemplate);

            this.setState({
                report: {
                    id: res.id,
                    name: res.name,
                    message: res.message,
                    action: res.action,
                    solved: res.solved
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    updateReport(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let id = data.get("id");
        let checkbox = data.get("solved");
        let solved;

        let report = {
            name: data.get("name"),
            message: data.get("message"),
            action: data.get("action")
        };

        if (checkbox) {
            report.solved = new Date().toISOString().slice(0, 19).replace('T', ' ');
        } else {
            report.solved = false;
        }

        let res = db.update("report", id, report);

        res.then(utils.reload(this, "/admin"));
    }

    inputHandler(e) {
        let key = e.target.name;
        let report = this.state.report;
        let value = e.target.value;

        if (key === "solved") {
            report[key] = report[key] ? false : new Date().toISOString().substring(0, 10);
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
                <form action="/update" className="form-register" onSubmit={this.updateReport}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getReport(e.target.value) }>
                        <option disabled selected value>Klicka här</option>
                        { this.state.reportGroups }
                    </select>
                    { this.state.report
                        ?
                        <div>
                            <h2 className="center">{ this.state.title }</h2>

                            <input className="form-input" type="hidden" name="id" required value={ this.state.report.id } />

                            <label className="form-label">Titel
                                <input className="form-input" type="text" name="name" required value={ this.state.report.name } placeholder="Ett namn som förklare snabbt problemet." onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Meddelande
                                <textarea className="form-input" name="message" required value={ this.state.report.message } placeholder="Skriv något om problemet." onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Åtgärdning
                                <input className="form-input" type="text" name="action" placeholder="Förklara åtgärdningen" value={ this.state.report.action } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="solved" value={ this.state.report.solved } checked={ this.state.report.solved ? "checked" : false } onChange={ this.inputHandler } />
                                Åtgärdat { this.state.report.solved ? " - " + new Date(this.state.report.solved).toISOString().substring(0, 10) : null }
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
