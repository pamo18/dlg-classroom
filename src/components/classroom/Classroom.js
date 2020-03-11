/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
// import auth from '../../models/auth.js';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import icon from '../../models/icon.js';
import './Classroom.css';
import image from "../../assets/classroom/default.jpg";

class Classroom extends Component {
    constructor(props) {
        super(props);
        this.showClassroom = this.showClassroom.bind(this);
        this.loadDevices = this.loadDevices.bind(this);
        this.getDevices = this.getDevices.bind(this);
        this.state = {
            title: "Klassrum vy",
            data: [],
            groups: [],
            myOptions: [],
            nameTemplate: "name",
            name: null,
            image: image,
            classroom: null,
            devices: [],
            classroomDevicesRows: [],
            classroomDevicesCount: null
        };
    }

    componentDidMount() {
        this.loadClassrooms();
    }

    loadClassrooms() {
        let that = this;
        let res = db.fetchAll("classroom");

        res.then(function(data) {
            let formData = form.group(data, "location", "id", that.state.nameTemplate);

            that.setState({
                data: formData.data,
                groups: formData.groups
            });
        });
    }

    showClassroom(e) {
        let id = e.target.value;

        try {
            let res = this.state.data[id];
            let name = form.optionName(res, this.state.nameTemplate);

            try {
                this.setState({
                    image: require(`../../assets/classroom/${res.image}`)
                });
            } catch(error) {
                console.log(error);
            }

            this.setState({
                name: name,
                classroom: {
                    id: res.id,
                    name: res.name,
                    type: res.type,
                    location: res.location,
                    level: res.level,
                    image: res.image
                },
                image: image
            }, () => this.loadDevices(id));
        } catch(err) {
            console.log(err);
        }
    }

    loadDevices(id) {
        let that = this;
        let res = db.fetchAllWhere("classroom/device", id);

        res.then(function(data) {
            that.setState({
                devices: data
            }, () => that.getDevices());
        });
    }

    getDevices() {
        let count = 0;
        let that = this;
        let classroomDevicesRows = this.state.devices.map(function(device) {
            count++;

            return [
                <tr key={`classroomDevice-${device.id}`} className="clickable" onClick={ () => utils.redirect(that, "/device", {id: device.id}) }>
                    <td data-title="Kategori">{ icon.get(device.category)}</td>
                    <td data-title="Märke">{ device.brand }</td>
                    <td data-title="Modell">{ device.model }</td>
                    <td data-title="Länk"><a href={ device.url } target="_blank">Till produktsida</a></td>
                </tr>
            ]});

        this.setState({
            classroomDevicesRows: classroomDevicesRows,
            classroomDevicesCount: count
        });
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
                    <div className="left-column">
                        <div className="classroom-control">
                            <form action="/profile" className="form" onSubmit={this.registerSubmit}>
                                <h2 className="center margin">Välj Klassrum</h2>
                                <select className="form-input" type="text" name="classroom" required onChange={ this.showClassroom }>
                                    <option disabled selected>Klicka för att välja</option>
                                    <optgroup label="Mina klassrum">
                                        { this.state.myClassrooms }
                                    </optgroup>
                                    { this.state.groups }
                                </select>
                            </form>
                        </div>
                    </div>
                    <div className="main-column">
                        <div className="classroom-view">
                            <div>
                                <h2 className="center margin">
                                    DLG
                                    { this.state.name
                                    ? " " + this.state.name
                                    : null
                                    }
                                </h2>
                                <div className="classroom-image">
                                    <img src={ this.state.image } alt="Classroom image"/>
                                </div>
                            </div>

                            { this.state.classroomDevicesCount != null
                                ?
                                <h3 class="center">{ `Antal apparater: ${ this.state.classroomDevicesCount}` }</h3>
                                :
                                null
                            }

                            { this.state.classroomDevicesRows.length > 0
                                ?
                                <table className="results">
                                    <thead>
                                        <tr>
                                            <th>Kategori</th>
                                            <th>Märke</th>
                                            <th>Modell</th>
                                            <th>Länk URL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.classroomDevicesRows }
                                    </tbody>
                                </table>
                                :
                                null
                            }
                        </div>
                    </div>
                </article>
            </main>
        );
    }
}

export default Classroom;
