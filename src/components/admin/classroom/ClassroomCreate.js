/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import '../Admin.css';

class ClassroomCreate extends Component {
    constructor(props) {
        super(props);
        this.classroomCreate = this.classroomCreate.bind(this);
        this.state = {
            title: "Lägga till Klassrum",
            buildings: []
        };
    }

    componentDidMount() {
        this.buildings();
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

    classroomCreate(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        let classroom = {
            name: data.get("name"),
            type: data.get("type"),
            building: data.get("building"),
            level: data.get("level"),
            image: data.get("image")
        };

        let res = db.insert("classroom", classroom);

        res.then(utils.reload(this, "/admin/classroom/view"));
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form action="/create" className="form-register" onSubmit={this.classroomCreate}>
                    <label className="form-label">Namn
                        <input className="form-input" type="text" name="name" required placeholder="A-2057" />
                    </label>

                    <label className="form-label">Typ
                        <input className="form-input" type="text" name="type" required placeholder="Standard" />
                    </label>

                    <label className="form-label">Hus
                        <select className="form-input" type="text" name="building" required>
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
                        <input className="form-input" type="number" name="level" required placeholder="1" />
                    </label>

                    <label className="form-label">Bild länk
                        <input className="form-input" type="text" name="image" required placeholder="classroom/A-2057" />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Skapa" />
                </form>
            </article>
        );
    }
}

export default withRouter(ClassroomCreate);
