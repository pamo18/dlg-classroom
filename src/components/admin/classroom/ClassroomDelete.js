/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import '../Admin.css';

class ClassroomDelete extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.deleteClassroom = this.deleteClassroom.bind(this);
        this.state = {
            title: "Radera Klassrum",
            data: [],
            options: [],
            classroom: null,
        };
    }

    componentDidMount() {
        this.loadClassrooms();
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let allData = {};
            let options = [];

            data.forEach(function(row) {
                let id = row.id;
                let name = row.name;

                allData[id] = row;
                options.push(
                    <option key={ id } value={ id }>{ name }</option>
                );
            });

            that.setState({
                data: allData,
                options: options
            });
        });
    }

    getClassroom(e) {
        let id = e.target.value;

        try {
            let res = this.state.data[id];

            this.setState({
                classroom: {
                    id: res.id,
                    name: res.name
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    deleteClassroom(e) {
        e.preventDefault();
        let that = this;
        const data = new FormData(e.target);
        let id = data.get("id");

        let res = db.delete("classroom", id);

        res.then(utils.reload(this, "/"));
    }

    render() {
        return (
            <div className="double-column">
                <div className="column-2">
                    <div className="form-wrapper">
                        <h2 className="center">Välj klassrum att radera</h2>
                        <form action="/delete" className="form-register">
                            <select className="form-input" type="text" name="name" required onChange={ this.getClassroom }>
                                <option disabled selected>Klicka här för att välja Klassrum</option>
                                { this.state.options }
                            </select>
                        </form>
                    </div>
                    { this.state.classroom ?
                        <div className="form-wrapper">
                            <h2 className="center">{ this.state.title }</h2>
                            <form action="/delete" className="form-register" onSubmit={ this.deleteClassroom }>
                                <input className="form-input" type="hidden" name="id" required value={ this.state.classroom.id } />

                                <label className="form-label">Namn
                                    <input className="form-input" type="text" name="name" required readonly value={ this.state.classroom.name } />
                                </label>

                                <label className="form-label check-label">
                                    <input className="check-input" type="checkbox" name="confirm" required />
                                    Radera klassrummet från systemet?
                                </label><br />

                                <input className="button center-margin" type="submit" name="delete" value="Radera" />
                            </form>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(ClassroomDelete);
