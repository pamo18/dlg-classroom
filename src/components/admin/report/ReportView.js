/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Redirect, Link } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            data: [],
            column: "location",
            filter: "Alla"
        };
    }

    componentDidMount() {
        let state = this.props.restore("reportViewState");

        if (state) {
            this.setState(state, () => this.loadReports(this.state.filter));
        } else {
            this.loadReports(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("reportViewState", this.state);
    }

    loadReports(filter) {
        let column = this.state.column;
        let res;

        if (filter === "Alla") {
            res = db.fetchAll("report");
        } else {
            res = db.fetchAllWhere("report", column, filter);
        }

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            });
        });
    }

    filter(filter) {
        this.loadReports(filter);
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        filterCb={ this.filter }
                        url="building"
                        categoryName="name"
                        sourceState="reportViewState"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results large-rows">
                    <thead>
                        <tr>
                            <th width="15%">Klassrum</th>
                            <th width="30%">Vad</th>
                            <th width="30%">Beskrivning</th>
                            <th width="5%">ag</th>
                            <th width="5%">ad</th>
                            <th width="15%">Hantera</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.data.map((report) => {
                            return [
                                <tr>
                                    <td data-title="Klassrum">
                                    <figure className="icon-text">
                                        { icon.get("View", () => utils.redirect(this, `/classroom`, {id: report.classroom_id})) }
                                        <figcaption>
                                            <span className="caption-text">
                                                { report.classroom_name }
                                            </span>
                                        </figcaption>
                                    </figure>
                                    </td>
                                    <td data-title="Vad">
                                        <figure className="icon-text">
                                            { icon.get("View", () => utils.redirect(this, `/${report.item}`, {id: report.device_id || report.classroom_id})) }
                                            <figcaption>
                                                <span className="caption-text">
                                                    { report.item === "device" ? `${report.device_brand} ${report.device_model}` : "Allämnt" }
                                                </span>
                                            </figcaption>
                                        </figure>
                                    </td>
                                    <td data-title="Beskrivning"><div className="table-message">{ report.message }</div></td>
                                    <td data-title="Åtgärdning">{ report.action || "-" }</td>
                                    <td data-title="Åtgärdat">{ report.solved || "-" }</td>
                                    <td data-title="Hantera">
                                        { icon.get("Edit", () => this.adminHandler("edit", report.id)) }
                                        { icon.get("Delete", () => this.adminHandler("delete", report.id)) }
                                    </td>
                                </tr>
                            ];
                        })}
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ReportView);
