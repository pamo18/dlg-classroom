/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import table from '../../../models/table.js';
import icon from '../../../models/icon.js';
import '../Admin.css';
import Categories from '../../filter/Categories.js';

class ClassroomView extends Component {
    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.state = {
            title: "Klassrum vy",
            toggle: window.innerWidth <= 900 ? "close" : "open",
            data: [],
            classroomTable: {
                head: [],
                body: []
            },
            filter: {},
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
            let edit = () => utils.redirect(this, `/admin/classroom/edit/${ classroom.id }`);
            let del = () => utils.redirect(this, `/admin/classroom/delete/${ classroom.id }`);
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

    toggleFilter() {
        this.setState({
            toggle: this.state.toggle === "close" ? "open" : "close"
        });
    }

    render() {
        return (
            <article>
                <div className={`filter-panel ${ this.state.toggle }`}>
                    <div className="dropdown">
                        { icon.get(this.state.toggle === "close" ? "Drop-down" : "Drop-up", this.toggleFilter) }
                    </div>
                    <Categories
                        title="Filter Hus"
                        filterCb={ this.filter }
                        url="classroom/building"
                        category="building"
                        stateName="classroomCategory1"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />

                    <Categories
                        title="Filter Status"
                        filterCb={ this.filter }
                        url="report/filter"
                        category="solved"
                        stateName="classroomCategory2"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results-card">
                    <tbody>
                        { this.state.classroomTable.body }
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ClassroomView);
