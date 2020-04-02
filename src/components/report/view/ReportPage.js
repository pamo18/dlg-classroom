/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import ReportList from './ReportList.js';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import image from '../../../models/image.js';
import table from '../../../models/table.js';
import '../Report.css';

class ReportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Felanmälning",
            id: this.props.location.state.id,
            report: {}
        };
    }

    componentDidMount() {
        this.loadReport();
    }

    loadReport() {
        let res = db.fetchWhere("report", "report.id", this.state.id);

        res.then((data) => {
            console.log(data);
            this.setState({
                report: data,
                reportList: <ReportList onRef={ref => (this.list = ref)} itemGroup={ data.item_group } itemid={ data.item_id } />
            });
        });
    }

    render() {
        return (
            <article>
                <h1 className="center">{ this.state.title }</h1>

                <div className="report-image">
                    <img src={ image.get(this.state.report.classroom_image) } alt="Classroom image"/>
                </div>

                {
                    Object.entries(this.state.report).length > 0
                        ?
                        <table className="results-alt">
                            <tr>
                                <th>Titel</th>
                                <td>{ this.state.report.name }</td>
                            </tr>
                            <tr>
                                <th>Skapad</th>
                                <td>{ this.state.report.created ? utils.convertSqlDate(this.state.report.created) : "-" }</td>
                            </tr>
                            <tr>
                                <th>Klassrum</th>
                                <td>{ this.state.report.classroom_name }</td>
                            </tr>
                            <tr>
                                <th>Hus</th>
                                <td>{ this.state.report.classroom_location }</td>
                            </tr>
                            <tr>
                                <th>Fel</th>
                                <td>{ this.state.report.device_id ? this.state.report.device_brand + " " + this.state.report.device_model : "Allmänt" }</td>
                            </tr>
                            <tr>
                                <th>Meddeland</th>
                                <td>{ this.state.report.message }</td>
                            </tr>
                            <tr>
                                <th>Åtgärdning</th>
                                <td>{ this.state.report.action || "-" }</td>
                            </tr>
                            <tr>
                                <th>Åtgärdat</th>
                                <td>{ this.state.report.solved ? utils.convertSqlDate(this.state.report.solved) : "-" }</td>
                            </tr>
                        </table>
                        :
                        null
                }

                { this.state.reportList }

            </article>
        );
    }
}

export default withRouter(ReportPage);
