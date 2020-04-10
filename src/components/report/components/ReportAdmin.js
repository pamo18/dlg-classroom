import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import icon from '../../../models/icon.js';
import table from '../../../models/table.js';
import '../Report.css';

class ReportAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            actions: []
        };
    }

    componentDidMount() {
        this.admin();
    }

    admin() {
        let id = this.state.id;
        let view = () => utils.redirect(this, "/report/page", { id: id }, false);
        let edit = () => utils.redirect(this, `/admin/report/edit/${ id }`, {});
        let del = () => utils.redirect(this, `/admin/report/delete/${ id }`, {});

        let actions = [
            icon.get("View", view),
            icon.get("Edit", edit),
            icon.get("Delete", del)
        ];

        this.setState({
            actions: actions
        })
    }

    render() {
        return (
            <div>
                { this.state.actions }
            </div>
        );
    }
}

export default withRouter(ReportAdmin);
