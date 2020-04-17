/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';
import form from '../../models/form.js';
import './Me.css';

class PersonUpdate extends Component {
    constructor(props) {
        super(props);
        this.updatePerson = this.updatePerson.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.state = {
            title: "Uppdatera Personuppgifter",
            person: JSON.parse(localStorage.getItem("person")),
            hidden: true,
            invalid: false,
            departments: []
        };
    }

    componentDidMount() {
        this.departments();
    }

    departments() {
        let res = db.fetchAll("person/department");

        res.then((data) => {
            this.setState({
                departments: data
            });
        });
    }

    updatePerson(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        let currentPerson = JSON.parse(localStorage.getItem("person"));
        let id = data.get("id");

        let person = {
            "firstname": data.get("firstname"),
            "lastname": data.get("lastname"),
            "email": data.get("email"),
            "department": data.get("department")
        };

        let res = db.update("person", id, person);

        res.then(() => {
            if (data.get("new-password")) {
                let currentPerson = {
                    "email": data.get("email"),
                    "oldPassword": data.get("old-password"),
                    "newPassword": data.get("password")
                };
                let changePassword = db.changePassword(currentPerson);

                changePassword.then((res) => {
                    let updatedPerson = {
                        "email": data.get("email"),
                        "password": data.get("password")
                    };
                    let login = db.changePassword(currentPerson);

                    login.then((data) => {
                        let invalid = false;
                        let person;

                        switch(true) {
                            case (!data.email):
                                invalid = "Ogiltid epost!";
                                break;
                            case (data.email && !data.password):
                                invalid = "Ogiltid lösenord";
                                break;
                            case (data.email && data.password):
                                person = data.person;
                                localStorage.setItem("person", JSON.stringify(person));
                                return utils.goBack(this);
                        }

                        this.setState({
                            invalid: <p className="center invalid"><error>{ invalid }</error></p>
                        });
                    });
                });
            } else {
                currentPerson["firstname"] = data.get("firstname");
                currentPerson["lastname"] = data.get("lastname");
                currentPerson["email"] = data.get("email");
                currentPerson["department"] = data.get("department");

                localStorage.setItem("person", JSON.stringify(currentPerson));
                return utils.goBack(this);
            }
        });
    }

    inputHandler(e) {
        let key = e.target.name;
        let person = this.state.person;
        let val = e.target.value;

        person[key] = e.target.value;

        this.setState({
            person: person
        });
    }

    toggleShowPassword() {
        this.setState({
            hidden: !this.state.hidden,
            button: !this.state.button
        });
    }

    render() {
        const { showing } = this.state;
        return (
            <article>
            <div>
                <h2 class="center">{ this.state.title }</h2>

                <form className="form-register" onSubmit={ this.updatePerson }>
                    <input className="form-input" type="hidden" name="id" required value={ this.state.person.id } />

                    <label className="form-label">Förnamn
                        <input className="form-input" type="text" name="firstname" value={ this.state.person.firstname } required placeholder="Ditt förnamn" onChange={ this.inputHandler } />
                    </label>

                    <label className="form-label">Efternamn
                        <input className="form-input" type="text" name="lastname" value={ this.state.person.lastname } required placeholder="Ditt efternamn" onChange={ this.inputHandler } />
                    </label>

                    <label className="form-label">Avdelning
                        <select className="form-input" type="text" name="department" required>
                            <option disable selected>Välj</option>
                            {
                                this.state.departments.map((row) => {
                                    let department = row.department;
                                    return [
                                        <option key={ department } selected={ this.state.person.department === row.department ? "selected" : null } value={ department }>{ department }</option>
                                    ]
                                })
                            }
                        </select>
                    </label>

                    <label className="form-label">Epost
                        <input className="form-input" type="email" name="email" value={ this.state.person.email } required placeholder="abc@lidkoping.se" onChange={ this.inputHandler } />
                    </label>

                    <label className="form-label">Gammla Lösenord
                        <input
                            className="form-input password"
                            type="password"
                            name="old-password"
                            placeholder="Din gammla lösenord"
                        />
                    </label>

                    <label className="form-label">Nya Lösenord
                        <input
                            className="form-input password"
                            type={this.state.hidden ? "password" : "text"}
                            name="new-password"
                            placeholder="Din nya lösenord"
                        />
                        <p><input type="checkbox" className="show-password" onClick={this.toggleShowPassword} /> {this.state.button ? "Visa" : "Dölja"} Lösenord</p>
                    </label>

                    <input className="button center-margin" type="submit" name="update" value="Uppdatera" />
                    { this.state.invalid }
                </form>
            </div>
            </article>
        );
    }
}

export default withRouter(PersonUpdate);
