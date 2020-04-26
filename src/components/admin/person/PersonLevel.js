/* eslint max-len: ["error", { "code": 300 }] */
/* eslint eqeqeq: "off" */

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import '../Admin.css';

class PersonLevel extends Component {
    constructor(props) {
        super(props);
        this.getPerson = this.getPerson.bind(this);
        this.toggleAdmin = this.toggleAdmin.bind(this);
        this.state = {
            title: "Ändra Behörighet",
            personData: {},
            personGroups: [],
            personTemplate: "firstname,lastname,(level)",
            person: null
        };
    }

    componentDidMount() {
        this.loadPeople();
    }

    loadPeople() {
        let res = db.fetchAll("person");
        let id = this.props.id || null;

        res.then((data) => {
            let organize = form.organize(data, "department", "id");
            let personData = organize.data;
            let personGroups = organize.groups;
            let template = this.state.personTemplate;
            let formGroups = form.group(personGroups, "id", template, (optionId) => optionId == id);

            this.setState({
                personData: personData,
                personGroups: formGroups
            });
        });
    }

    getPerson(id) {
        try {
            let res = this.state.personData[id];
            let name = form.optionName(res, this.state.personTemplate);

            this.setState({
                person: {
                    id: res.id,
                    name: name,
                    level: res.level
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    toggleAdmin(e) {
        e.preventDefault();
        const person = this.state.person;
        const data = new FormData(e.target);
        let id = data.get("id");

        let admin = {
            "level": person.level === "user" ? "admin" : "user"
        };

        let res = db.update("person", id, admin);

        return res.then(() => { utils.reload(this) });
    }

    render() {
        return (
            <article>
                <h2 className="center">{ this.state.title }</h2>
                <form className="form-register" onSubmit={ this.toggleAdmin }>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getPerson(e.target.value) }>
                        <option disabled selected>Klicka för att välja</option>
                            { this.state.personGroups }
                    </select>
                    { this.state.person
                        ?
                        <div>
                            <input className="form-input" type="hidden" name="id" required value={ this.state.person.id } />

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="confirm" required />
                                Växla persons behörighet från admin till user eller user till admin?
                            </label><br />

                            <input className="button center-margin" type="submit" name="delete" value={ this.state.person.level === "user" ? "Ändra till admin" : "Ändra till user" } />
                        </div>
                        :
                        null
                    }
                </form>
            </article>
        );
    }
}

export default withRouter(PersonLevel);
