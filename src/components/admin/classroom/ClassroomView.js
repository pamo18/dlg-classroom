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
        this.state = {
            title: "Klassrum vy",
            data: [],
            classroomTable: {
                head: [],
                body: []
            },
            column: "location",
            filter: "Alla",
            selection: [
                ["name", null],
                ["type", null],
                ["level", null],
                ["location", null],
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
        let column = this.state.column;
        let res;

        if (filter === "Alla") {
            res = db.fetchAll("classroom");
        } else {
            res = db.fetchAllWhere("classroom", column, filter);
        }

        res.then((data) => {
            this.setState({
                data: data,
                filter: filter
            }, () => this.getClassroom());
        });
    }

    getClassroom() {
        let selection = this.state.selection;

        let rows = this.state.data.map(classroom => {
            let view = icon.get("View", () => utils.redirect(this, "/classroom", {id: classroom.id}));

            return table.classroomBody(classroom, selection, view);
        });

        this.setState({
            classroomTable: {
                head: table.classroomHead(selection),
                body: rows
            }
        });
    }

    filter(filter) {
        this.loadClassroom(filter);
    }

    render() {
        return (
            <article>
                <div className="admin-control category-control">
                    <Categories
                        filterCb={ this.filter }
                        url="building"
                        categoryName="name"
                        sourceState="classroomViewState"
                        save={ this.props.save }
                        restore={ this.props.restore }
                    />
                </div>

                <table className="results">
                    <thead>
                        { this.state.classroomTable.head }
                    </thead>
                    <tbody>
                        { this.state.classroomTable.body }
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ClassroomView);
