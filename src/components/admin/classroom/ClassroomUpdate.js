/*eslint max-len: ["error", { "code": 300 }]*/
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class ClassroomUpdate extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.updateClassroom = this.updateClassroom.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.state = {
            title: "Redigera Klassrum",
            buildings: [],
            classroomData: [],
            classroomGroups: [],
            classroomTemplate: "name",
            classroom: null
        };
    }

    componentDidMount() {
        this.buildings();
        this.loadClassrooms();
    }

    buildings() {
        let res = db.fetchAll("classroom/building");
        let that = this;

        res.then(function(data) {
            that.setState({
                buildings: data
            });
        });
    }

    loadClassrooms() {
        let res = db.fetchAll("classroom");
        let id = this.props.id || null;

        res.then((data) => {
            let organize = form.organize(data, "building", "id");
            let classroomData = organize.data;
            let classroomGroups = organize.groups;
            let template = this.state.classroomTemplate;
            let formGroups = form.group(classroomGroups, "id", template, (optionId) => optionId == id);

            this.setState({
                classroomData: classroomData,
                classroomGroups: formGroups
            }, () => {
                if (id) {
                    this.getClassroom(id);
                }
            });
        });
    }

    getClassroom(id) {
        try {
            let res = this.state.classroomData[id];

            this.setState({
                classroom: {
                    id: res.id,
                    name: res.name,
                    type: res.type,
                    building: res.building,
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
            building: data.get("building"),
            level: data.get("level"),
            image: data.get("image")
        };

        let res = db.update("classroom", id, classroom);

        res.then(utils.goBack(this));
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
            <article>
                <h2 className="center">Välj klassrum att redigera</h2>
                <form action="/update" className="form-register" onSubmit={this.updateClassroom}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getClassroom(e.target.value) }>
                        <option disabled selected value>Klicka här för att välja Klassrum</option>
                        { this.state.classroomGroups }
                    </select>
                    { this.state.classroom
                        ?
                        <div>
                            <h2 className="center">{ this.state.title }</h2>

                            <input className="form-input" type="hidden" name="id" required value={ this.state.classroom.id } />

                            <label className="form-label">Namn
                                <input className="form-input" type="text" name="name" required placeholder="A-2057" value={ this.state.classroom.name } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Typ
                                <input className="form-input" type="text" name="type" required placeholder="Standard" value={ this.state.classroom.type } onChange={ this.inputHandler } />
                            </label>

                            <label className="form-label">Hus
                                <select className="form-input" type="text" name="building" required value={ this.state.classroom.building } onChange={ this.inputHandler } >
                                    {
                                        this.state.buildings.map(function(row) {
                                            let building = row.building;
                                            return [
                                                <option key={ building } value={ building }>{ building }</option>
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
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(ClassroomUpdate);
