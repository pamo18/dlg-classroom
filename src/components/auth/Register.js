/*eslint max-len: ["error", { "code": 300 }]*/

import React, { Component } from 'react';
import  { withRouter } from 'react-router-dom';
import db from '../../models/db.js';
import utils from '../../models/utils.js';

class Register extends Component {
    constructor(props) {
        super(props);
        this.registerSubmit = this.registerSubmit.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.state = {
            title: "Registrera",
            departments: [],
            showing: false,
            password: "",
            hidden: true,
            button: true,
            strength: 0
        };
    }

    componentDidMount() {
        // Load departments
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

    registerSubmit(event) {
        const that = this;

        event.preventDefault();
        const data = new FormData(event.target);

        let person = {
            "firstname": data.get("firstname"),
            "lastname": data.get("lastname"),
            "email": data.get("email"),
            "department": data.get("department"),
            "password": data.get("password")
        };

        let res = db.register(person);

        res.then(utils.reload(this, "/login"));
    }

    onPasswordChange(e) {
        this.setState({
            strength: utils.passwordChecker(e.target.value),
            password: e.target.value
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
            <main>
                <div className="single-column">
                    <div className="column-heading">
                        <h1>{ this.state.title }</h1>
                    </div>
                    <article>
                        <form className="form-register" onSubmit={this.registerSubmit}>
                            <p className="center">För att använda DLG Classroom måste du först registrera dig.</p>
                            <label className="form-label">Förnamn
                                <input className="form-input" type="text" name="firstname" required placeholder="Ditt förnamn" />
                            </label>

                            <label className="form-label">Efternamn
                                <input className="form-input" type="text" name="lastname" required placeholder="Ditt efternamn" />
                            </label>

                            <label className="form-label">Avdelning
                                <select className="form-input" type="text" name="department" required>
                                    <option disable selected>Välj</option>
                                    {
                                        this.state.departments.map(function(row) {
                                            let department = row.department;
                                            return [
                                                <option key={ department } value={ department }>{ department }</option>
                                            ]
                                        })
                                    }
                                </select>
                            </label>

                            <label className="form-label">Epost
                                <input className="form-input" type="email" name="email" required placeholder="abc@lidkoping.se" />
                            </label>

                            <label className="form-label">Lösenord: Minst 1 stor bokstäv, 1 siffra, 4+ bokstäver lång.
                                <input
                                    className="form-input password"
                                    type={this.state.hidden ? "password" : "text"}
                                    name="password"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}"
                                    value={this.state.password}
                                    placeholder="Ett stark lösenord"
                                    onChange={this.onPasswordChange}
                                    required
                                />
                                <p>
                                    <input type="checkbox" className="show-password" onClick={this.toggleShowPassword} />
                                    {this.state.button ? "Visa" : "Dölja"} lösenord
                                </p>
                            </label>

                            <label className="form-label">Lösenord styrke
                                <meter className="form-meter" min="0" low="4" optimum="9" high="8" max="10" value={this.state.strength}></meter>
                            </label>

                            <label className="form-label check-label">
                                <input className="check-input" type="checkbox" name="gdpr" required />
                                Jag samtycker sidans <a href="https://en.wikipedia.org/wiki/Terms_of_service">policy</a>
                            </label><br />

                            <input className="button center-margin" type="submit" name="register" value="Registrera" />
                        </form>
                    </article>
                </div>
            </main>
        );
    }
}

export default withRouter(Register);
