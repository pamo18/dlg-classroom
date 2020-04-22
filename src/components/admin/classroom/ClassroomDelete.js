/* eslint max-len: ["error", { "code": 300 }] */
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class ClassroomDelete extends Component {
    constructor(props) {
        super(props);
        this.getClassroom = this.getClassroom.bind(this);
        this.deleteClassroom = this.deleteClassroom.bind(this);
        this.state = {
            title: "Radera Klassrum",
            classroomData: [],
            classroomGroups: [],
            classroomTemplate: "name",
            classroom: null,
        };
    }

    componentDidMount() {
        this.loadClassrooms();
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
            let name = form.optionName(res, this.state.classroomTemplate);

            this.setState({
                classroom: {
                    id: res.id,
                    name: name
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    deleteClassroom(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let id = data.get("id");

        let res = db.delete("classroom", id);

        res.then(utils.goBack(this));
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form action="/delete" className="form-register" onSubmit={ this.deleteClassroom }>
                    <select className="form-input" type="text" name="name" required onChange={ (e) => this.getClassroom(e.target.value) }>
                        <option disabled selected>Välj här</option>
                        { this.state.classroomGroups }
                    </select>
                    { this.state.classroom
                        ?
                        <div>
                            <input className="form-input" type="hidden" name="id" required value={ this.state.classroom.id } />

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="confirm" required />
                                Radera klassrummet från systemet?
                            </label><br />

                            <input className="button center-margin" type="submit" name="delete" value="Radera" />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(ClassroomDelete);
