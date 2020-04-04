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
        let view = () => utils.redirect(this, "/report/page", { id: id });
        let edit = () => utils.redirect(this, "/admin", { selected: "report", admin:"edit", id: id });
        let del = () => utils.redirect(this, "/admin", { selected: "report", admin:"delete", id: id });

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
