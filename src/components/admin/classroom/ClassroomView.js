/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter, Redirect, Link } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
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
            column: "location",
            filter: "Alla"
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomViewState");

        if (state) {
            this.setState(state, () => this.loadDevice(this.state.filter));
        } else {
            this.loadDevice(this.state.filter);
        }
    }

    componentWillUnmount() {
        this.props.save("classroomViewState", this.state);
    }

    loadDevice(filter) {
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
            });
        });
    }

    filter(filter) {
        this.loadDevice(filter);
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
                        <tr>
                            <th>Name</th>
                            <th>Typ</th>
                            <th>Våning</th>
                            <th>Hus</th>
                            <th>Hantera</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.data.map((classroom) => {
                            return [
                                <tr>
                                    <td data-title="Name">{ classroom.name }</td>
                                    <td data-title="Typ">{ classroom.type }</td>
                                    <td data-title="Våning">{ classroom.level }</td>
                                    <td data-title="Hus">{ classroom.location }</td>
                                    <td data-title="Hantera">{ icon.get("View", () => utils.redirect(this, "/classroom", {id: classroom.id})) }</td>
                                </tr>
                            ];
                        })}
                    </tbody>
                </table>
            </article>
        );
    }
}

export default withRouter(ClassroomView);
