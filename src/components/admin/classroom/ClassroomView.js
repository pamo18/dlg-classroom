/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Redirect, Link } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import table from '../../../models/table.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';

class ClassroomView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.adminHandler = this.adminHandler.bind(this);
        this.state = {
            title: "Klassrum vy",
            data: [],
            classroomTable: {
                head: [],
                body: []
            },
            filter: {
                location: "Alla"
            },
            selection: [
                ["name-caption-large", null],
                ["manage", null]
            ],
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomViewState");

        if (state) {
            this.setState(state, () => this.loadClassroom(this.state.filter));
        } else {
            this.loadClassroom(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("classroomViewState", this.state);
    }

    loadClassroom(filter) {
        let res = db.fetchAllManyWhere("classroom", filter);

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            }, () => this.getClassrooms());
        });
    }

    getClassrooms() {
        let selection = this.state.selection;

        let classroomRows = this.state.data.map(async classroom => {
            let view = () => utils.redirect(this, "/classroom", {id: classroom.id});
            let edit = () => this.adminHandler("edit", classroom.id);
            let del = () => this.adminHandler("delete", classroom.id);
            let reportList = () => utils.redirect(this, "/report/list", { itemGroup: "classroom", itemid: classroom.id });
            let reportStatus = await db.reportCheck("classroom", classroom.id);
            let actions = [
                icon.reportStatus(reportList, reportStatus),
                icon.get("View", view),
                icon.get("Edit", edit),
                icon.get("Delete", del)
            ];

            return table.classroomBody(classroom, selection, actions);
        });

        Promise.all(classroomRows).then((rows) => {
            this.setState({
                classroomTable: {
                    body: rows
                }
            });
        });
    }

    filter(category, filter) {
        let currentFilter = this.state.filter;

        currentFilter[category] = filter;

        this.setState({
            filter: currentFilter
        }, () => this.loadClassroom(this.state.filter));
    }

    adminHandler(view, id) {
        this.props.admin(view, id);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        title="Hus"
                        filterCb={ this.filter }
                        url="building"
                        category="name"
                        filterCategory="location"
                        stateName="classroomCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <div className="admin-control category-control">
                    <Categories
                        title="Status"
                        filterCb={ this.filter }
                        url="report/filter"
                        category="solved"
                        stateName="classroomCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results-home">
                    <tbody>
                        { this.state.classroomTable.body }
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ClassroomView);
