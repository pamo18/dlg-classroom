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
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.state = {
            title: "Uppdatera Personuppgifter",
            person: JSON.parse(localStorage.getItem("person")),
            departments: [],
            invalid: false,
            changePass: false,
            password: "",
            strength: 0,
            button: true,
            hidden: true
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
        let id = data.get("id");

        let updatedPerson = {
            "firstname": data.get("firstname"),
            "lastname": data.get("lastname"),
            "email": data.get("email"),
            "department": data.get("department")
        };

        let res = db.update("person", id, updatedPerson);

        res.then(() => {
            let currentPerson = JSON.parse(localStorage.getItem("person"));

            currentPerson["firstname"] = updatedPerson["firstname"];
            currentPerson["lastname"] = updatedPerson["lastname"];
            currentPerson["email"] = updatedPerson["email"];
            currentPerson["department"] = updatedPerson["department"];

            localStorage.setItem("person", JSON.stringify(currentPerson));

            if (data.get("new-password")) {
                let person = {
                    "id": id,
                    "oldPassword": data.get("old-password"),
                    "newPassword": data.get("new-password")
                };
                let changePassword = db.changePassword(person);

                changePassword.then((res) => {
                    let invalid = false;

                    if (res.hasOwnProperty("err")) {
                        invalid = res.err;

                        return this.setState({
                            invalid: <p className="center invalid"><error>{ invalid }</error></p>
                        });
                    } else {
                        return utils.goBack(this);
                    }
                });
            } else {
                return utils.goBack(this);
            }
        });
    }

    inputHandler(e) {
        let key = e.target.name;
        let person = this.state.person;
        let val = e.target.value;

        person[key] = val;

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

    onPasswordChange(e) {
        let val = e.target.value;

        this.setState({
            strength: utils.passwordChecker(e.target.value),
            password: e.target.value,
            changePass: val ? true : false
        });
    }

    render() {
        // eslint-disable-next-line
        const { showing } = this.state;
        return (
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article>
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

                            <label className="form-label">Gamla Lösenordet
                                <input
                                    className="form-input password"
                                    type="password"
                                    name="old-password"
                                    placeholder="Ditt gamla lösenord"
                                    required={ this.state.changePass ? "required" : false }
                                />
                            </label>

                            <label className="form-label">Ny Lösenord: Minst 1 stor bokstäv, 1 siffra, 4+ bokstäver lång.
                                <input
                                    className="form-input password"
                                    type={this.state.hidden ? "password" : "text"}
                                    name="new-password"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                                    value={this.state.password}
                                    placeholder="Ditt nya lösenord"
                                    onChange={ this.onPasswordChange }
                                    required={ this.state.changePass ? "required" : false }
                                />
                                <p><input type="checkbox" className="show-password" onClick={ this.toggleShowPassword } /> { this.state.button ? "Visa" : "Dölja" } Lösenord</p>
                            </label>

                            <label className="form-label">Lösenord styrka
                                <meter className="form-meter" min="0" low="4" optimum="9" high="8" max="10" value={ this.state.strength }></meter>
                            </label><br />

                            <input className="button center-margin" type="submit" name="update" value="Uppdatera" />
                            { this.state.invalid }
                        </form>
                    </article>
                </div>
            </main>
        );
    }
}

export default withRouter(PersonUpdate);
