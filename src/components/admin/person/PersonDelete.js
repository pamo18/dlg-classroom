/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../../models/db.js';
import utils from '../../../models/utils.js';
import form from '../../../models/form.js';
import { AuthContext } from "../../auth/auth.js";
import '../Admin.css';

class PersonDelete extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.getPerson = this.getPerson.bind(this);
        this.deletePerson = this.deletePerson.bind(this);
        this.state = {
            title: "Radera Person",
            personData: {},
            personGroups: [],
            personTemplate: "firstname,lastname",
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
                    name: name
                }
            });
        } catch(err) {
            console.log(err);
        }
    }

    deletePerson(e) {
        e.preventDefault();
        const { setAuth } = this.context;
        const person = JSON.parse(localStorage.getItem("person"));
        const data = new FormData(e.target);
        let id = data.get("id");
        let that = this;

        let res = db.delete("person", id);

        if (id == person.id) {
            localStorage.clear();
            setAuth(null, null);
            return utils.redirect(this, "/login");
        } else {
            return res.then(utils.goBack(this));
        }
    }

    render() {
        return (
            <article>
                <h2 className="center">Välj person att radera</h2>
                <form action="/delete" className="form-register" onSubmit={this.deletePerson}>
                    <select className="form-input" type="text" name="fullname" required onChange={ (e) => this.getPerson(e.target.value) }>
                        <option disabled selected>Klicka för att välja</option>
                            { this.state.personGroups }
                    </select>
                    { this.state.person
                        ?
                        <div>
                            <h2 class="center">{ this.state.title }</h2>
                            <input className="form-input" type="hidden" name="id" required value={ this.state.person.id } />

                            <label className="form-label">Namn
                                <input className="form-input" type="text" name="name" required value={ this.state.person.name } />
                            </label>

                            <label className="form-label check-label">
                                OBS Alla raporter skapade av { this.state.person.name } kommer att försvinna också.<br /><br />
                                <input className="check-input" type="checkbox" name="confirm" required />
                                Radera personen från systemet?
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

export default withRouter(PersonDelete);
