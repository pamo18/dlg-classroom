/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import db from '../../../models/db.js';
import '../Admin.css';

class ClassroomDelete extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.deleteClassroom = this.deleteClassroom.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.state = {
            title: "Radera Klassrum",
            buildings: [],
            current: null,
            allOptions: [],
            data: []
        };
    }

    componentDidMount() {
        this.buildings();
        this.loadClassrooms();
    }

    buildings() {
        let res = db.fetchAll("building");
        let that = this;

        res.then(function(data) {
            that.setState({
                buildings: data
            });
        });
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let allData = {};
            let allOptions = [];

            data.forEach(function(row) {
                let name = row.name;

                allData[name] = row;
                allOptions.push(
                    <option key={ name } value={ name }>{ name }</option>
                );
            });

            that.setState({
                allOptions: allOptions,
                data: allData
            });
        });
    }

    getClassroom(e) {
        let that = this;
        let name = e.target.value;
        let res = db.fetchWhere("classroom", name);

        res.then(function(data) {
            that.setState({
                current: data,
                name: data.name,
                type: data.type,
                location: data.location,
                level: data.level,
                image: data.image
            });
        });
    }

    deleteClassroom(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let name = data.get("name");

        let res = db.delete("classroom", name);

        res.then(this.props.history.push('/'));
    }

    inputHandler(e) {
        let key = e.target.name;

        this.setState({
            [key]: e.target.value
        });
    }

    render() {
        return (
            <div>
                <div className="form-wrapper">
                    <h2 className="center">Välj klassrum</h2>
                    <form action="/delete" className="form-register">
                        <select className="form-input" type="text" name="name" required onChange={this.getClassroom}>
                            <option disabled selected value>Klicka här för att välja Klassrum</option>
                            { this.state.allOptions }
                        </select>
                    </form>
                </div>
                { this.state.current ?
                    <div className="form-wrapper">
                        <h2 className="center">{ this.state.title }</h2>
                        <form action="/update" className="form-register" onSubmit={this.deleteClassroom}>
                            <label className="form-label">Namn
                                <input className="form-input" type="text" name="name" required readonly value={ this.state.name } />
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
        );
    }
}

export default ClassroomDelete;
