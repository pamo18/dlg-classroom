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
            filter: "location",
            value: "Alla"
        };
    }

    componentDidMount() {
        let state = this.props.restore("classroomViewState");

        if (state) {
            this.setState(state);
        } else {
            this.loadDevice(this.state.filter, this.state.value);
        }
    }

    componentWillUnmount() {
        this.props.save("classroomViewState", this.state);
    }

    loadDevice(filter, value) {
        let res

        if (value === "Alla") {
            res = db.fetchAll("classroom");
        } else {
            res = db.fetchAllWhere("classroom", filter, value);
        }

        res.then((data) => {
            this.setState({
                data: data,
                value: value
            });
        });
    }

    filter(value) {
        this.loadDevice(this.state.filter, value);
    }

    render() {
        return (
            <main>
                <div className="page-heading">
                    <h1>
                        { this.state.title }
                    </h1>
                </div>
                <article>
                    <div className="single-column">
                        <div className="admin-control category-control">
                            <Categories
                                filterCb={ this.filter }
                                url="building"
                                name="name"
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

                        { this.state.data.map((classroom) => {
                            return [
                                <tbody>
                                    <tr>
                                        <td>{ classroom.name }</td>
                                        <td>{ classroom.type }</td>
                                        <td>{ classroom.level }</td>
                                        <td>{ classroom.location }</td>
                                        <td>{ icon.get("View", () => utils.redirect(this, "/classroom", {id: classroom.id})) }</td>
                                    </tr>
                                </tbody>
                            ];
                        })}

                        </table>
                    </div>
                </article>
            </main>
        );
    }
}

export default withRouter(ClassroomView);
