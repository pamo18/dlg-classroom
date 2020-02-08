/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import db from '../../../models/db.js';
import '../Admin.css';

class ClassroomUpdate extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.updateClassroom = this.updateClassroom.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.state = {
            title: "Uppdatera Klassrum",
            buildings: [],
            current: null,
            allOptions: [],
            data: [],
            name: null,
            type: null,
            location: null,
            level: null,
            image: null
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

    updateClassroom(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let name = data.get("name");

        let classroom = {
            name: name,
            type: data.get("type"),
            location: data.get("location"),
            level: data.get("level"),
            image: data.get("image")
        };

        let res = db.update("classroom", name, classroom);

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
                    <form action="/create" className="form-register">
                        <select className="form-input" type="text" name="name" required onChange={this.getClassroom}>
                            <option disabled selected value>Klicka här för att välja Klassrum</option>
                            { this.state.allOptions }
                        </select>
                    </form>
                </div>
                { this.state.current ?
                    <div className="form-wrapper">
                        <h2 className="center">{ this.state.title }</h2>
                        <form action="/update" className="form-register" onSubmit={this.updateClassroom}>
                            <label className="form-label">Namn
                                <input className="form-input" type="text" name="name" required placeholder="A-2057" value={ this.state.name } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Typ
                                <input className="form-input" type="text" name="type" required placeholder="Standard" value={ this.state.type } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Hus
                                <select className="form-input" type="text" name="location" required value={ this.state.location } onChange={ this.inputHandler } >
                                    {
                                        this.state.buildings.map(function(building) {
                                            let name = building.name;
                                            return [
                                                <option key={ name } value={ name }>{ name }</option>
                                            ]
                                        })
                                    }
                                </select>
                            </label>

                            <label className="form-label">Våning
                                <input className="form-input" type="number" name="level" required placeholder="1" value={ this.state.level } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Bild länk
                                <input className="form-input" type="text" name="image" required placeholder="classroom/A-2057" value={ this.state.image } onChange={ this.inputHandler } />
                            </label>

                            <input className="button center-margin" type="submit" name="create" value="Uppdatera" />
                        </form>
                    </div>
                    : null
                }
            </div>
        );
    }
}

export default ClassroomUpdate;
