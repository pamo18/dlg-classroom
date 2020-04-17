/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import icon from '../../models/icon.js';
import image from '../../models/image.js';
import './Classroom.css';

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Klassrum vy",
            id: "",
            classoom: {}
        };
    }

    componentDidMount() {
        if (this.props.location.state) {
            this.setState({
                id: this.props.location.state.id
            }, () => this.loadClassroom());
        }
    }

    componentWillUnmount() {
        window.scrollTo(0, 0);
    }

    loadClassroom() {
        let that = this;
        let res = db.fetchWhere("classroom", "id", this.state.id);

        res.then(function(data) {
            that.setState({
                classroom: data
            });
        });
    }

    render() {
        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article className="classroom-view">
                        <div>
                            { this.state.classroom && Object.entries(this.state.classroom).length > 0
                                ?
                                <div>
                                    <h2 className="center margin">
                                        { icon.get(this.state.classroom.building) }<br />
                                        { this.state.classroom.name }
                                    </h2>
                                    <div className="classroom-view-image">
                                        <img src={ image.get(this.state.classroom.image) } alt="Classroom image"/>
                                    </div>
                                    <table className="results-alt">
                                        <tr>
                                            <th>Namn</th>
                                            <td>{ this.state.classroom.name }</td>
                                        </tr>
                                        <tr>
                                            <th>Typ</th>
                                            <td>{ this.state.classroom.type }</td>
                                        </tr>
                                        <tr>
                                            <th>Hus</th>
                                            <td>{ this.state.classroom.building }</td>
                                        </tr>
                                        <tr>
                                            <th>Våning</th>
                                            <td>{ this.state.classroom.level }</td>
                                        </tr>
                                        <tr>
                                            <th>Bild Länk</th>
                                            <td>{ this.state.classroom.image }</td>
                                        </tr>
                                    </table>
                                </div>
                                :
                                null
                                }
                        </div>
                    </article>
                </div>
            </main>
        );
    }
}

export default Classroom;
