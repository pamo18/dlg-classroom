/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
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
            data: [],
            options: [],
            classroom: null
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
                options: options,
                data: allData
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
                    name: res.name,
                    type: res.type,
                    location: res.location,
                    level: res.level,
                    image: res.image
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    updateClassroom(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let id = data.get("id");

        let classroom = {
            name: data.get("name"),
            type: data.get("type"),
            location: data.get("location"),
            level: data.get("level"),
            image: data.get("image")
        };

        let res = db.update("classroom", id, classroom);

        res.then(utils.reload(this, "/"));
    }

    inputHandler(e) {
        let key = e.target.name;
        let classroom = this.state.classroom;
        classroom[key] = e.target.value;

        this.setState({
            classroom: classroom
        });
    }

    render() {
        return (
            <div className="double-column">
                <div className="column-2">
                    <div className="form-wrapper">
                        <h2 className="center">Välj klassrum att uppdatera</h2>
                        <form action="/" className="form-register">
                            <select className="form-input" type="text" name="name" required onChange={ this.getClassroom }>
                                <option disabled selected value>Klicka här för att välja Klassrum</option>
                                { this.state.options }
                            </select>
                        </form>
                    </div>
                    { this.state.classroom ?
                        <div className="form-wrapper">
                            <h2 className="center">{ this.state.title }</h2>
                            <form action="/update" className="form-register" onSubmit={this.updateClassroom}>
                                <input className="form-input" type="hidden" name="id" required value={ this.state.classroom.id } />

                                <label className="form-label">Namn
                                    <input className="form-input" type="text" name="name" required placeholder="A-2057" value={ this.state.classroom.name } onChange={ this.inputHandler } />
                                </label>

                                <label className="form-label">Typ
                                    <input className="form-input" type="text" name="type" required placeholder="Standard" value={ this.state.classroom.type } onChange={ this.inputHandler } />
                                </label>

                                <label className="form-label">Hus
                                    <select className="form-input" type="text" name="location" required value={ this.state.classroom.location } onChange={ this.inputHandler } >
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
                                    <input className="form-input" type="number" name="level" required placeholder="1" value={ this.state.classroom.level } onChange={ this.inputHandler } />
                                </label>

                                <label className="form-label">Bild länk
                                    <input className="form-input" type="text" name="image" required placeholder="classroom/A-2057" value={ this.state.classroom.image } onChange={ this.inputHandler } />
                                </label>

                                <input className="button center-margin" type="submit" name="create" value="Uppdatera" />
                            </form>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(ClassroomUpdate);
