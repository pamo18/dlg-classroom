/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
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
            id: null,
            data: [],
            dataCategory: [],
            filter: "location",
            value: "all"
        };
    }

    componentDidMount() {
        this.loadDevice(this.state.filter, this.state.value);
    }

    loadDevice(filter, value) {
        let that = this;
        let res

        if (value === "all") {
            res = db.fetchAll("classroom");
        } else {
            res = db.fetchAllWhere("classroom", filter, value);
        }

        res.then(function(data) {
            that.setState({
                data: data
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
                        <Categories
                            filterCb={ this.filter }
                            url="building"
                            name="name"
                        />
                        <table className="results">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Typ</th>
                                    <th>Våning</th>
                                    <th>Hus</th>
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

export default ClassroomView;
