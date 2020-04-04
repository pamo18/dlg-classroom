/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class ReportDelete extends Component {
    constructor(props) {
        super(props);
        this.getReport = this.getReport.bind(this);
        this.deleteReport = this.deleteReport.bind(this);
        this.state = {
            title: "Radera felanmälning",
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
            let formGroups = form.group(reportGroups, "id", template, (optionId) => optionId === id);

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
            let name = form.optionName(res, this.state.reportTemplate);

            this.setState({
                report: {
                    id: res.id,
                    name: res.name
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    deleteReport(e) {
        e.preventDefault();
        let that = this;
        const data = new FormData(e.target);
        let id = data.get("id");

        let res = db.delete("report", id);

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <article>
                <h2 className="center">Välj felanmälning att radera</h2>
                <form action="/delete" className="form-register" onSubmit={ this.deleteReport }>
                    <select className="form-input" type="text" name="name" required onChange={ (e) => this.getReport(e.target.value) }>
                        <option disabled selected>Klicka här</option>
                        { this.state.reportGroups }
                    </select>
                    { this.state.report
                        ?
                        <div>
                            <h2 className="center">{ this.state.title }</h2>
                            <input className="form-input" type="hidden" name="id" required value={ this.state.report.id } />

                            <label className="form-label">Titel
                                <input className="form-input" type="text" name="name" readonly value={ this.state.report.name } />
                            </label>

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="confirm" required />
                                Radera felanmälningen från systemet?
                            </label><br />

                            <input className="button center-margin" type="submit" name="delete" value="Radera" />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(ReportDelete);