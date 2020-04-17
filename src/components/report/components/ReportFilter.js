/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';

class ReportFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            filter: this.props.filter,
            selection : this.props.selection,
            actions: this.props.actions || [],
            data: [],
            table: {
                head: [],
                body: []
            },
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        this.loadReports();
    }

    loadReports() {
        let res = db.fetchAllManyWhere("report", this.state.filter);

        res.then((data) => {
            this.setState({
                data: data
            }, () => this.getReports());
        });
    }

    getReports() {
        let selection = this.state.selection;

        let reports= this.state.data.map((report) => {
            let key = `report-${report.id}`;

            return table.reportBody(
                report,
                selection,
                this,
                this.getActions(this.state.actions, report.id)
            );
        });

        this.setState({
            table: {
                head: table.reportHead(selection),
                body: reports
            }
        });
    }

    getActions(actionList, id) {
        let view = () => utils.redirect(this, "/report/page", { id: id });
        let edit = () => utils.redirect(this, `/admin/report/edit/${ id }`, {});
        let del = () => utils.redirect(this, `/admin/report/delete/${ id }`, {});

        let allActions = {
            view: icon.get("View", view),
            edit: icon.get("Edit", edit),
            delete: icon.get("Delete", del)
        };

        let actions = actionList.map(action => { return allActions[action]; })

        return actions;
    }

    render() {
        return (
            <div>
                <h2 class="center">{ this.state.title }: { this.state.table.body.length }st </h2>

                { this.state.data.length > 0
                    ?
                    <table className="results large-rows">
                        <thead>
                            { this.state.table.head }
                        </thead>
                        <tbody>
                            { this.state.table.body }
                        </tbody>
                    </table>
                    :
                    null
                }
            </div>
        );
    }
}

export default withRouter(ReportFilter);
