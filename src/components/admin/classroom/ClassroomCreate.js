/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import db from '../../../models/db.js';
import '../Admin.css';

class ClassroomCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Skapa Klassrum",
            buildings: []
        };
    }

    componentDidMount() {
        this.buildings();
    }

    buildings() {
        let res = db.getBuildnings();
        let that = this;

        res.then(function(data) {
            that.setState({
                buildings: data
            });
        });
    }

    render() {
        return (
            <div className="form-wrapper">
                <h2 class="center">{ this.state.title }</h2>
                <form action="/login" className="form-register" onSubmit={this.registerSubmit}>
                    <label className="form-label">Namn
                        <input className="form-input" type="text" name="name" required placeholder="A-2057" />
                    </label>

                    <label className="form-label">Typ
                        <input className="form-input" type="text" name="type" required placeholder="Standard" />
                    </label>

                    <label className="form-label">Hus
                        <select className="form-input" type="text" name="building" required>
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
                        <input className="form-input" type="number" name="level" required placeholder="1" />
                    </label>

                    <label className="form-label">Bild länk
                        <input className="form-input" type="text" name="image" required placeholder="classroom/A-2057" />
                    </label>

                    <input className="button center-margin" type="submit" name="create" value="Skapa" />
                </form>
            </div>
        );
    }
}

export default ClassroomCreate;
